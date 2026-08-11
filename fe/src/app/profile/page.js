import { getSession } from "@/lib/dal";
import { beJson } from "@/lib/api";
import ButtonBack from "@/ui/buttonBack/page";
import styles from "./profile.module.scss";
import ProfileActions from "./ProfileActions";


export default async function ProfilePage() {
    const session = await getSession();
    let user = null;
    let error = null;

    try {
        // Lấy thông tin chi tiết của người dùng đang đăng nhập
        // Giả định API backend trả về user với các quan hệ `profile`, `position`, `department`
        user = await beJson(`/users/${session.id}`);
        console.log("my profile:", user);
    } catch (e) {
        error = "Không thể tải thông tin cá nhân. Vui lòng thử lại sau.";
    }

    if (error) {
        return <main className={styles['profile-page']}><p className="error-banner">{error}</p></main>;
    }

    if (!user) {
        return <main className={styles['profile-page']}><p>Đang tải...</p></main>;
    }

    const getMinioUrl = (objectKey) => {
        if (!objectKey) return null;
        // process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL được cung cấp từ docker-compose.
        // Ví dụ: http://localhost:9000/abc-office
        return `${process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL}/${objectKey}`;
    }

    return (
        <main className={styles['profile-page']}>
            <div className={styles['profile-card']}>
                <ButtonBack to="/dashboard" />
                <div className={styles['profile-cover']} style={{ backgroundImage: `url(${getMinioUrl(user.profile?.coverUrl || 'car.png')})` }}></div>
                <div className={styles['profile-avatar']}>
                    <img src={getMinioUrl(user.profile?.avatarUrl || 'gon.jpeg')} alt="User Avatar" />
                </div>
                <div className={styles['profile-content']}>
                    <div className={styles['profile-info']}>
                        <h1 className={styles['user-name']}>{user.profile?.full_name || user.username}</h1>
                        <p className={styles['user-title']}>{user.position?.title || 'Chưa có chức vụ'}</p>
                    </div>
                    <div className={styles['profile-details']}>
                        <h2>Thông tin liên hệ</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Số điện thoại:</strong> {user.profile?.phone || 'Chưa cập nhật'}</p>
                        <p><strong>Phòng ban:</strong> {user.department?.name || 'Chưa tham gia phòng ban'}</p>
                    </div>
                    <ProfileActions />
                </div>
            </div>
        </main>
    );
}