import AttendanceItem from '../attendanceItem/attendanceItem';
import styles from './BoardAttendance.module.scss';

export default function BoardAttendance({ data }) {
    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');
    const filteredData = data.filter(item => {
        if (item.type === 'padding') return true;
        return item.date <= todayStr;
    });

    return (
        <div className={styles['board-attendance']}>
            <div className={styles.weekHeader}>
                {weekDays.map(day => (
                    <div key={day} className={styles.weekDay}>{day}</div>
                ))}
            </div>

            <div className={styles['attendance-grid']}>
                {filteredData.map((item, index) => {
                    const isToday = item.date === todayStr;
                    
                    return (
                        <AttendanceItem 
                            key={item.date || `padding-${index}`} 
                            item={item} 
                            isToday={isToday}
                        />
                    );
                })}
            </div>
        </div>
    );
}