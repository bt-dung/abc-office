"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ButtonBack from '@/ui/buttonBack/page';
import styles from './edit.module.scss';
import { updateUserProfile, getCurrentUserProfile, uploadProfileImage } from './actions';
import ImageUploader from '@/ui/imageUploader/ImageUploader';

const getMinioUrl = (objectKey) => {
    if (!objectKey) return null;
    return `${process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL}/${objectKey}`;
}

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await getCurrentUserProfile();
                setUser(currentUser);
                setFormData({
                    username: currentUser.username || '',
                    email: currentUser.email || '',
                    fullName: currentUser.profile?.full_name || '',
                    phone: currentUser.profile?.phone || '',
                });
            } catch (err) {
                setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            if (name === 'avatar') setAvatarFile(files[0]);
            else if (name === 'cover') setCoverFile(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        startTransition(async () => {
            if (!user) {
                setError("Không thể xác định người dùng để cập nhật.");
                return;
            }

            const operations = [];

            operations.push({
                name: 'Cập nhật thông tin',
                promise: updateUserProfile(user.id, {
                    username: formData.username,
                    email: formData.email,
                    profile: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                    },
                })
            });

            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('file', avatarFile);
                operations.push({
                    name: 'Tải lên ảnh đại diện',
                    promise: uploadProfileImage(user.id, 'avatar', avatarFormData)
                });
            }

            if (coverFile) {
                const coverFormData = new FormData();
                coverFormData.append('file', coverFile);
                console.log("Uploading cover image:", coverFile);
                operations.push({
                    name: 'Tải lên ảnh bìa',
                    promise: uploadProfileImage(user.id, 'cover', coverFormData)
                });
            }
            console.log("operations:", operations);

            const results = await Promise.allSettled(operations.map(op => op.promise));

            const failedOperations = [];
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const reason = result.reason?.message || 'Lỗi không xác định';
                    failedOperations.push(`- ${operations[index].name}: ${reason}`);
                }
            });

            if (failedOperations.length > 0) {
                setError(failedOperations.join('\n'));
            } else {
                router.push('/profile');
            }
        });
    };

    if (loading) {
        return <main className={styles.container}><p>Đang tải...</p></main>;
    }

    if (error && !user) {
        return <main className={styles.container}><p className="error-banner">{error}</p></main>;
    }

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <ButtonBack to="/profile" />
                <h1 className={styles.title}>Chỉnh sửa thông tin cá nhân</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} readOnly className={styles.readOnlyInput} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">Họ và tên</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Chưa có thông tin" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Chưa có thông tin" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Số điện thoại</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Chưa có thông tin" />
                    </div>

                    <ImageUploader
                        variant="avatar"
                        name="avatar"
                        label="Ảnh đại diện"
                        existingImageUrl={getMinioUrl(user?.profile?.avatarUrl)}
                        onFileChange={handleFileChange}
                    />

                    <ImageUploader
                        variant="cover"
                        name="cover"
                        label="Ảnh bìa"
                        existingImageUrl={getMinioUrl(user?.profile?.coverUrl)}
                        onFileChange={handleFileChange}
                    />

                    <div className={styles.actions}>
                        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.back()}>
                            Hủy
                        </button>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isPending}>
                            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}