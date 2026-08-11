"use client";

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faImage } from '@fortawesome/free-solid-svg-icons';
import styles from './imageUploader.module.scss';

export default function ImageUploader({ name, label, existingImageUrl, onFileChange, variant = 'cover' }) {
    const [preview, setPreview] = useState(existingImageUrl);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setPreview(existingImageUrl);
    }, [existingImageUrl]);

    const handleFileChangeInternal = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileChange(e);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles.container}>
            <label>{label}</label>
            <div className={styles.wrapper} onClick={handleEditClick}>
                <div className={`${styles.variant} ${styles[variant]}`}>
                    {preview ? (
                        <>
                            <img src={preview} alt={label} className={styles.imagePreview} />
                            <div className={styles.editIconWrapper}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <FontAwesomeIcon icon={faImage} />
                            <span>Tải ảnh lên</span>
                        </div>
                    )}
                </div>
                <input type="file" name={name} ref={fileInputRef} onChange={handleFileChangeInternal} accept="image/*" style={{ display: 'none' }} />
            </div>
        </div>
    );
}