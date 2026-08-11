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
    // Làm mới cả trang profile và trang edit để thấy ảnh mới
    revalidatePath('/profile/edit');
    revalidatePath('/profile');
}

export async function getCurrentUserProfile() {
    const session = await getSession();
    if (!session?.id) {
        // Trường hợp này lý tưởng sẽ được middleware xử lý và chuyển hướng về trang đăng nhập
        throw new Error("User not authenticated");
    }
    // Lấy thông tin chi tiết của người dùng, bao gồm các quan hệ như profile, department, v.v.
    return await beJson(`/users/${session.id}`);
}
