/**
 * Get the current date and time formatted as DD/MM/YYYY HH:MM:SS:MMM [Timezone].
 * 
 * @returns {string} - The formatted date and time string.
 */
const getFormattedDateTime = () => {
    const date = new Date();

    /**
     * Pad a number to two digits.
     * 
     * @param {number} num - The number to pad.
     * @returns {string} - The padded number as a string.
     */
    const padToTwoDigits = (num) => String(num).padStart(2, '0');

    /**
     * Pad a number to three digits.
     * 
     * @param {number} num - The number to pad.
     * @returns {string} - The padded number as a string.
     */
    const padToThreeDigits = (num) => String(num).padStart(3, '0');

    const day = padToTwoDigits(date.getDate());
    const month = padToTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = padToTwoDigits(date.getHours());
    const minutes = padToTwoDigits(date.getMinutes());
    const seconds = padToTwoDigits(date.getSeconds());
    const milliseconds = padToThreeDigits(date.getMilliseconds());

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}:${milliseconds} ${timezone}`;
};

// Get the formatted date and time string upon module initialization.
const DateTime = getFormattedDateTime();

export { DateTime };