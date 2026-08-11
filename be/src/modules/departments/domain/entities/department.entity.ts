import {User} from '../../../users/domain/entities/user.entity';
export class Department {
    // ... (constructor và các thuộc tính)
    constructor(
        public readonly id: number | null,
        public name: string,
        public parent_id: number | null,
        public manager_id: number | null,
        public children: Department[] = [],
        public users: User[] = [],
    ) {}

    /**
     * Factory method để tạo một phòng ban con mới.
     * Đảm bảo logic tạo phòng ban được tập trung.
     * @param name Tên phòng ban con
     * @param parentId ID của phòng ban cha
     * @param managerId ID của người quản lý (tùy chọn)
     * @returns Một thực thể Department mới
     */
    public static createNew(name: string, parentId: number | null, managerId: number | null): Department {
        // Ở đây có thể thêm các logic validate phức tạp hơn nếu cần
        // Ví dụ: kiểm tra tên không được rỗng, v.v.
        return new Department(null, name, parentId, managerId);
    }

    public addChild(child: Department) {
        this.children.push(child);
    }

    public addUser(user: User) {
        this.users.push(user);
    }

    public getId(): number | null {return this.id;}
    public getName(): string {return this.name;}
    public getParentId(): number | null {return this.parent_id;}
    public getManagerId(): number | null {return this.manager_id;}
    public getChildren(): Department[] {return this.children;}
    public getUsers(): User[] {return this.users;}

     public updateInfo(data: { name?: string; parent_id?: number | null; manager_id?: number | null; }) {
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.parent_id !== undefined) {
            // Business Invariant: Một phòng ban không thể là cha của chính nó.
            // `this.id` chỉ có giá trị khi entity được lấy từ DB, không phải khi mới tạo.
            if (this.id !== null && data.parent_id === this.id) {
                throw new Error('Một phòng ban không thể tự làm cha của chính nó.');
            }
            this.parent_id = data.parent_id;
        }
        if (data.manager_id !== undefined) {
            this.manager_id = data.manager_id;
        }
    }
}