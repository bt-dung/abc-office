"use client";

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './MonthPicker.module.scss';

export default function MonthPicker({ year, month, setFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempYear, setTempYear] = useState(year); 
    const boardRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTempYear(year);
        }
    }, [isOpen, year]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boardRef.current && !boardRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleSelectMonth = (m) => {
        setFilter({ month: m, year: tempYear });
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={boardRef}>
            <button 
                className={styles["filter-date"]} 
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <div className={styles["filter-date-content"]}>
                    <span>Tháng {month?.toString().padStart(2, '0')}, {year}</span>
                    <FontAwesomeIcon icon={faChevronDown} className={styles["caret-icon"]} />
                </div>
            </button>

            {isOpen && (
                <div className={styles.monthBoard}>
                    <div className={styles['year-selector']}>
                        <button 
                            type="button"
                            className={styles.navBtn} 
                            onClick={() => setTempYear(prev => prev - 1)}
                        >
                            &lt;
                        </button>

                        <div className={styles['year-display']}>
                            Năm {tempYear}
                        </div>

                        <button 
                            type="button"
                            className={styles.navBtn} 
                            onClick={() => setTempYear(prev => prev + 1)}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className={styles.grid}>
                        {months.map((m) => (
                            <div 
                                key={m}
                                className={`${styles.item} ${(month === m && year === tempYear) ? styles.selected : ''}`}
                                onClick={() => handleSelectMonth(m)}
                            >
                                Tháng {m}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}