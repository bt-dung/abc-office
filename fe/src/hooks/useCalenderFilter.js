"use client";
import { useState, useCallback } from 'react';

export const useCalendarFilter = () => {
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const getFormattedDate = () => {
    return `${filter.year}-${String(filter.month).padStart(2, '0')}`;
  };

  return {
    month: filter.month,
    year: filter.year,
    formattedDate: getFormattedDate(),
    setFilter 
  };
};