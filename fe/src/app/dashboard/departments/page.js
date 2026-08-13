import { beJson } from "@/lib/api";
import { getSession } from "@/lib/dal";
import { hasPermission } from "@/auth/authorization";
import { Permission } from "@/auth/permissions";
import DepartmentsClient from "./DepartmentsClient";
import MyTeam from "./MyTeam";

export default async function DepartmentsPage() {
  const user = await getSession();

  if (!hasPermission(user, Permission.DEPARTMENT_WRITE)) {
    let team = null;
    let positions = [];
    let loadError = null;

    try {
      [team, positions] = await Promise.all([
        beJson("/departments/me/members"),
        beJson("/positions"),
      ]);
    } catch (err) {
      loadError = err.message;
    }

    return <MyTeam team={team} positions={positions} loadError={loadError} />;
  }

  let departments = [];
  let users = [];
  let positions = [];
  let loadError = null;

  try {
    [departments, users, positions] = await Promise.all([
      beJson("/departments"),
      beJson("/users"),
      beJson("/positions"), // Lấy danh sách tất cả các vị trí
    ]);
    console.log("departments:", departments);
  } catch (err) {
    loadError = err.message;
  }

  return (
    <DepartmentsClient
      initialDepartments={departments}
      users={users}
      positions={positions}
      loadError={loadError}
    />
  );
}
