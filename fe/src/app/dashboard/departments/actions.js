"use server";

import { revalidatePath } from "next/cache";
import { beJson } from "@/lib/api";

function toManagerId(managerId) {
  return managerId ? Number(managerId) : undefined;
}

export async function createDepartment({ name, manager_id }) {
  await beJson("/departments", {
    method: "POST",
    body: JSON.stringify({ name, manager_id: toManagerId(manager_id) }),
  });
  revalidatePath("/dashboard/departments");
}

export async function addChildDepartment(parentId, { name, manager_id }) {
  await beJson(`/departments/${parentId}/children`, {
    method: "POST",
    body: JSON.stringify({ name, manager_id: toManagerId(manager_id) }),
  });
  revalidatePath("/dashboard/departments");
}

export async function updateDepartment(id, { name, manager_id }) {
  await beJson(`/departments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name, manager_id: toManagerId(manager_id) }),
  });
  revalidatePath("/dashboard/departments");
}

export async function dissolveDepartment(id) {
  await beJson(`/departments/${id}`, { method: "DELETE" });
  revalidatePath("/dashboard/departments");
}

export async function assignUserToDepartment(userId, deptId) {
  await beJson(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ dept_id: deptId }),
  });
  revalidatePath("/dashboard/departments");
  revalidatePath("/dashboard/users");
}

export async function removeUserFromDepartment(userId) {
  await beJson(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ dept_id: null }),
  });
  revalidatePath("/dashboard/departments");
  revalidatePath("/dashboard/users");
}
