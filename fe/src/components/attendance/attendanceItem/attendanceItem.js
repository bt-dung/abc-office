import styles from './AttendanceItem.module.scss';

export default function AttendanceItem({ item, isToday }) {
    if (item.type === 'padding') {
        return <div className={`${styles.item} ${styles.padding}`}></div>;
    }
    const statusMap = {
        'on-time': styles.statusOnTime,
        'late': styles.statusLate,
        'absent': styles.statusAbsent,
        'weekend': styles.statusWeekend,
        'incomplete': styles.statusIncomplete
    };
    const currentStatusClass = statusMap[item.status] || '';

    const todayClass = isToday ? styles.isToday : '';

    return (
        <div className={`${styles.attendanceItem} ${currentStatusClass} ${todayClass}`}>
            <div className={styles.dayHeader}>
                <span className={styles.dayNum}>{item.day}</span>
                <span className={styles.statusText}>{item.status}</span>
            </div>
            <div className={styles.timeInfo}>
                <div className={styles.timeRow}>
                    <span>Vào:</span>
                    <strong>{item.checkIn}</strong>
                </div>
                <div className={styles.timeRow}>
                    <span>Ra:</span>
                    <strong>{item.checkOut}</strong>
                </div>
            </div>
        </div>
    );
}