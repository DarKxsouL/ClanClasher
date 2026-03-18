/**
 * Checks if a specific date falls within a user's "Offline" window.
 * @param date The date to check (e.g., builder finish date)
 * @param startHour The hour the user goes offline (0-23)
 * @param endHour The hour the user comes online (0-23)
 */

/**
 * Adds duration to a date to calculate future completion.
 * Useful for the "Next in Queue" logic.
 */
export const calculateFutureFinish = (startDate: Date, durationSeconds: number): Date => {
  return new Date(startDate.getTime() + durationSeconds * 1000);
};




export const isTimeInOfflineWindow = (date: Date | string, start: number, end: number): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hour = d.getHours();
  // Handles midnight crossover (e.g., 23 to 7)
  return start > end ? (hour >= start || hour < end) : (hour >= start && hour < end);
};

export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h} ${period}`;
};