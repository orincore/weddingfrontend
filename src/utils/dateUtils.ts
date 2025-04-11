/**
 * Format a timestamp into a date string
 * @param {number} timestamp - The timestamp to format
 * @returns {string} Formatted date (e.g., "Jan 1, 2023")
 */
export const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format a timestamp into a time string
 * @param {number} timestamp - The timestamp to format
 * @returns {string} Formatted time (e.g., "3:45 PM")
 */
export const formatTime = (timestamp?: number): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a timestamp into a date and time string
 * @param {number} timestamp - The timestamp to format
 * @returns {string} Formatted date and time (e.g., "Jan 1, 2023 at 3:45 PM")
 */
export const formatDateTime = (timestamp?: number): string => {
  if (!timestamp) return 'N/A';
  
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
}; 