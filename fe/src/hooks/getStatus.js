export const getStatus = (record, dayOfWeek) => {
  if (!record) {
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'weekend';
    }
    return 'absent';
  }

  const isLate = record.check_in > "08:05";
  
  if (!record.check_out) {
    return 'incomplete';
  }

  return isLate ? 'late' : 'on-time';
};