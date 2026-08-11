"use client";
import { useState, useEffect } from "react";
import { DarkMode, LightMode } from "@mui/icons-material";
import styles from "./buttonDarkMode.module.scss";

const ButtonDarkMode = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.documentElement.dataset.theme = isDark ? "dark" : "light";
    }, [isDark]);

    return (
        <div className={styles.toggleWrapper}>
            {/* Thanh trượt tạo hiệu ứng background */}
            <div 
                className={`${styles.slider} ${isDark ? styles.darkActive : styles.lightActive}`} 
            />

            {/* Nút Light Mode */}
            <button 
                className={`${styles.iconBtn} ${!isDark ? styles.active : ""}`} 
                onClick={() => setIsDark(false)}
                aria-label="Light Mode"
            >
                <LightMode fontSize="small" />
            </button>

            {/* Nút Dark Mode */}
            <button 
                className={`${styles.iconBtn} ${isDark ? styles.active : ""}`} 
                onClick={() => setIsDark(true)}
                aria-label="Dark Mode"
            >
                <DarkMode fontSize="small" />
            </button>
        </div>
    );
};

export default ButtonDarkMode;