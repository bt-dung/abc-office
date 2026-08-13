import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Khởi tạo Prisma Client để tương tác với DB
// Khởi tạo Prisma Client với adapter để hỗ trợ connection pooling
// Điều này rất quan trọng cho các môi trường serverless hoặc có nhiều kết nối ngắn hạn.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PERMISSIONS = [
  'departments:read',
  'departments:write',
  'users:read',
  'users:write',
  'users:manage_position',
  'positions:read',
  'positions:write',
];

const ROLE_PERMISSIONS = {
  ADMIN: {
    'departments:read': 'all',
    'departments:write': 'all',
    'users:read': 'all',
    'users:write': 'all',
    'users:manage_position': 'all',
    'positions:read': 'all',
    'positions:write': 'all',
  },
  MANAGER: {
    'departments:read': 'all',
    'departments:write': 'own',
    'users:read': 'all',
    'users:write': 'own',
    'users:manage_position': 'own',
    'positions:read': 'all',
    'positions:write': 'own',
  },
  USER: {
    'departments:read': 'own',
    'users:read': 'own',
    'users:write': 'own', // Cho phép người dùng tự cập nhật thông tin của mình
    'positions:read': 'all',
  },
};

// Thông tin tài khoản admin mặc định
const BOOTSTRAP_ADMIN = {
  username: 'admin',
  email: 'admin@abc-office.local',
  password: 'Admin@123',
};

async function main() {
  console.log('Đang khởi tạo dữ liệu mẫu cho bảng Role...');
  const roles = [{ name: 'ADMIN' }, { name: 'MANAGER' }, { name: 'USER' }];
  const roleByName: { [key: string]: { id: number; name: string } } = {};
  for (const role of roles) {
    roleByName[role.name] = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log('Hoàn thành tạo dữ liệu Role!');

  console.log('Đang khởi tạo dữ liệu mẫu cho bảng Permission...');
  const permissionByName: { [key: string]: { id: number; name: string } } = {};
  for (const name of PERMISSIONS) {
    permissionByName[name] = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Hoàn thành tạo dữ liệu Permission!');

  console.log('Đang gán quyền cho từng Role...');
  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roleByName[roleName];
    for (const [permissionName, scope] of Object.entries(permissions)) {
      const permission = permissionByName[permissionName];
      if (!permission) {
        console.warn(`Cảnh báo: Quyền '${permissionName}' được định nghĩa cho vai trò '${roleName}' nhưng không tồn tại trong danh sách PERMISSIONS. Bỏ qua...`);
        continue;
      }
      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: { scope },
        create: {
          role_id: role.id,
          permission_id: permission.id,
          scope,
        },
      });
    }
  }
  console.log('Hoàn thành gán quyền cho Role!');

  console.log('Đang khởi tạo dữ liệu mẫu cho bảng Department...');
  const findOrCreateDept = async (name: string) => {
    let dept = await prisma.department.findFirst({ where: { name } });
    if (!dept) {
      dept = await prisma.department.create({ data: { name } });
    }
    return dept;
  };
  const financeDept = await findOrCreateDept('Finance & Accounting Department');
  const itDept = await findOrCreateDept('IT Department');
  const hrDept = await findOrCreateDept('HR Management');
  console.log('Hoàn thành tạo dữ liệu Department!');

  console.log('Đang khởi tạo dữ liệu mẫu cho bảng Position...');
  console.log(
    ` -> ID Phòng ban: Tài chính=${financeDept.id}, IT=${itDept.id}, HR=${hrDept.id}`,
  );
  const positions = [
    // Phòng Tài chính - Kế toán
    { title: 'Kế toán trưởng', dept_id: financeDept.id },
    { title: 'Kế toán tổng hợp', dept_id: financeDept.id },
    { title: 'Kế toán thanh toán', dept_id: financeDept.id },
    { title: 'Kế toán kho', dept_id: financeDept.id },
    { title: 'Chuyên viên tài chính', dept_id: financeDept.id },
    { title: 'Thủ quỹ', dept_id: financeDept.id },
    // Phòng Công nghệ thông tin
    { title: 'Giám đốc CNTT (CIO)', dept_id: itDept.id },
    { title: 'Trưởng phòng CNTT', dept_id: itDept.id },
    { title: 'Lập trình viên Backend', dept_id: itDept.id },
    { title: 'Lập trình viên Frontend', dept_id: itDept.id },
    { title: 'Quản trị hệ thống', dept_id: itDept.id },
    { title: 'Chuyên viên hỗ trợ kỹ thuật', dept_id: itDept.id },
    // Phòng Nhân sự
    { title: 'Giám đốc Nhân sự (CHRO)', dept_id: hrDept.id },
    { title: 'Trưởng phòng Nhân sự', dept_id: hrDept.id },
    { title: 'Chuyên viên tuyển dụng', dept_id: hrDept.id },
    { title: 'Chuyên viên C&B (Lương & Phúc lợi)', dept_id: hrDept.id },
  ];

  for (const pos of positions) {
    const existing = await prisma.position.findFirst({
      where: {
        title: pos.title,
        dept_id: pos.dept_id,
      },
    })
    if (!existing) {
      await prisma.position.create({
        data: pos,
      });
      console.log(` -> Đã tạo chức vụ: ${pos.title}`);
    } else {
      console.log(` -> Bỏ qua, chức vụ đã tồn tại: ${pos.title}`);
    }
  }
  console.log('Hoàn thành tạo dữ liệu Position!');

  console.log('Đang khởi tạo tài khoản admin mặc định...');
  const hashedPassword = await bcrypt.hash(BOOTSTRAP_ADMIN.password, 10);
  const adminUser = await prisma.user.upsert({
    where: { username: BOOTSTRAP_ADMIN.username },
    update: {},
    create: {
      username: BOOTSTRAP_ADMIN.username,
      email: BOOTSTRAP_ADMIN.email,
      pw: hashedPassword,
      status: UserStatus.ACTIVE,
      role_id: roleByName['ADMIN'].id,
    },
  });

  // Tạo profile mặc định cho admin
  await prisma.profile.upsert({
    where: { user_id: adminUser.id },
    update: {
      full_name: 'Administrator',
    },
    create: {
      user_id: adminUser.id,
      full_name: 'Administrator',
    },
  });
  console.log(
    `Hoàn thành! Tài khoản admin mặc định: ${BOOTSTRAP_ADMIN.username} / ${BOOTSTRAP_ADMIN.password}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });