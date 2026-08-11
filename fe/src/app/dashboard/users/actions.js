"use server";

import { revalidatePath } from "next/cache";
import { beJson } from "@/lib/api";

export async function createUser({ username, email, password, role_id, dept_id }) {
  await beJson("/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      role_id: Number(role_id),
      dept_id: dept_id ? Number(dept_id) : undefined,
    }),
  });
  revalidatePath("/dashboard/users");
}

export async function updateUser(id, { username, email, role_id, dept_id }) {
  await beJson(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      username,
      email,
      role_id: role_id ? Number(role_id) : undefined,
      dept_id: dept_id ? Number(dept_id) : undefined,
    }),
  });
  revalidatePath("/dashboard/users");
}

export async function activateUser(id) {
  await beJson(`/users/${id}/activate`, { method: "PATCH" });
  revalidatePath("/dashboard/users");
}

export async function deactivateUser(id) {
  await beJson(`/users/${id}/deactivate`, { method: "PATCH" });
  revalidatePath("/dashboard/users");
}
