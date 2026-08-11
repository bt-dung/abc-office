'use client';
import { useMemo } from 'react';
import {getStatus} from './getStatus';

export const useAttendanceData = (month, year, dbRecords) => {
    const board = useMemo(() => {
        const attendanceMap = new Map(dbRecords.map(item => [item.work_date, item]));
        
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfMonth = new Date(year, month -1, 1).getDay(); 
        const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        const tempBoard = [];

        for (let i = 0; i < emptySlots; i++) {
            tempBoard.push({ type: 'padding', id: `padding-${i}` });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = attendanceMap.get(dateKey);
            const dayOfWeek = new Date(year, month-1, day).getDay();

            tempBoard.push({
                type: 'data',
                date: dateKey,
                day: day,
                checkIn: record?.check_in || '--:--',
                checkOut: record?.check_out || '--:--',
                status: getStatus(record, dayOfWeek)
            });
        }

        return tempBoard;
    }, [month, year, dbRecords]);

    return board;
};