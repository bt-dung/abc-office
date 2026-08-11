"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from 'next/navigation';
import styles from "./buttonBack.module.scss";

const ButtonBack = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className={styles['sticky-anchor']}>
            <button className={`${styles['btn-back']} ${isScrolled ? styles['scrolled'] : ''}`} onClick={() => router.back()}>
                <span className={styles['icon-arrow-left']}><FontAwesomeIcon icon={faArrowLeft} /></span>
            </button>
        </div>
    );
};

export default ButtonBack;