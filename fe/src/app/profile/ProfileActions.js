"use client";

import { useRouter } from 'next/navigation';
import styles from './profile.module.scss';

export default function ProfileActions() {
    const router = useRouter();

    return (
        <div className={styles['profile-actions']}>
            <button className={`${styles['btn']} ${styles['btn-primary']}`} onClick={() => router.push('/profile/edit')}>
                Chỉnh sửa thông tin
            </button>
            <button className={`${styles['btn']} ${styles['btn-secondary']}`} onClick={() => router.push('/profile/change-password')}>
                Đổi mật khẩu
            </button>
        </div>
    );
}