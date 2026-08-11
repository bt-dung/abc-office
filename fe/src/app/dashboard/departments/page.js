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
    let loadError = null;

    try {
      team = await beJson("/departments/me/members");
    } catch (err) {
      loadError = err.message;
    }

    return <MyTeam team={team} loadError={loadError} />;
  }

  let departments = [];
  let users = [];
  let loadError = null;

  try {
    [departments, users] = await Promise.all([
      beJson("/departments"),
      beJson("/users"),
    ]);
  } catch (err) {
    loadError = err.message;
  }

  return (
    <DepartmentsClient
      initialDepartments={departments}
      users={users}
      loadError={loadError}
    />
  );
}
