"use client";
import styles from "./attendance.module.scss";
import { useCalendarFilter } from "@/hooks/useCalenderFilter";
import { useAttendanceData } from "@/hooks/useAttendanceData";
import MonthPicker from "@/components/attendance/monthPicker/monthPicker";
import BoardAttendance from "@/components/attendance/boardAttendance/boardAttendance";

const dbRecords = [
  { "work_date": "2026-05-04", "check_in": "07:55", "check_out": "17:05", "status": "on-time" },
  { "work_date": "2026-05-05", "check_in": "08:15", "check_out": "17:00", "status": "late" },
  { "work_date": "2026-05-07", "check_in": "07:45", "check_out": "17:10", "status": "on-time" },
  { "work_date": "2026-05-08", "check_in": "08:20", "check_out": "17:00", "status": "late" },
  { "work_date": "2026-05-11", "check_in": "07:50", "check_out": "17:00", "status": "on-time" },
  { "work_date": "2026-05-12", "check_in": "08:05", "check_out": "17:05", "status": "late" },
  { "work_date": "2026-05-13", "check_in": "07:50", "check_out": null, "status": "on-time" },
];

export default function AttendancePage() {
    const { month, year, setFilter } = useCalendarFilter();
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');

    const board = useAttendanceData(month, year, dbRecords);
    const filteredData = board.filter(item => {
        if (item.type === 'padding') return true;
        return item.date <= todayStr;
    });

    return (
        <div className={styles["attendance-page"]}>
            <div className={styles["attendance-page__header"]}>
                <h1 className={styles["title"]}>Bảng chấm công</h1>
            </div>
            <div className={styles["attendance-page__toolbar"]}>
                <MonthPicker year={year} month={month} setFilter={setFilter} />
                <div className={styles["attendance-statics"]}>
                    <div className={styles["statics-item"]}>
                        <span className={`${styles["statics-label"]} ${styles['statics-on-time']}`}>On Time:</span>
                        <span className={styles["statics-value"]}>{filteredData.filter(item => item.status === 'on-time').length}</span>
                    </div>
                    <div className={styles["statics-item"]}>
                        <span className={`${styles["statics-label"]} ${styles['statics-late']}`}>Late:</span>
                        <span className={styles["statics-value"]}>{filteredData.filter(item => item.status === 'late').length}</span>
                    </div>
                    <div className={styles["statics-item"]}>
                        <span className={`${styles["statics-label"]} ${styles['statics-absent']}`}>Absent:</span>
                        <span className={styles["statics-value"]}>{filteredData.filter(item => item.status === 'absent').length}</span>
                    </div>
                </div>
            </div>
            <div className={styles["attendance-page__content"]}>
                <BoardAttendance data={board} />
            </div>
        </div>
    );
}
