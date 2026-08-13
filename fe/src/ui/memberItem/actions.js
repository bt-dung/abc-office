"use server";

import { revalidatePath } from "next/cache";
import { beJson } from "@/lib/api";

export async function removeUserFromDepartment(userId) {
    await beJson(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ dept_id: null }),
    });
    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/users");
}

export async function assignPositionToUser(userId, positionId) {
    await beJson(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ position_id: positionId }),
    });
    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/users");
}

export async function unassignPositionFromUser(userId) {
    await beJson(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ position_id: null }),
    });
    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/users");
}