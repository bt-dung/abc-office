"use server";

import { revalidatePath } from "next/cache";
import { beJson, beFormData } from "@/lib/api";
import { getSession } from "@/lib/dal";

export async function updateUserProfile(userId, data) {
    await beJson(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

    // Làm mới dữ liệu của trang profile để hiển thị thông tin mới
    revalidatePath("/profile");
}

export async function uploadProfileImage(userId, imageType, formData) {
    await beFormData(`/users/${userId}/${imageType}`, formData, {
        method: 'PATCH',
    });
    revalidatePath('/profile/edit');
    revalidatePath('/profile');
}

export async function getCurrentUserProfile() {
    const session = await getSession();
    if (!session?.id) {
        throw new Error("User not authenticated");
    }
    return await beJson(`/users/${session.id}`);
}
