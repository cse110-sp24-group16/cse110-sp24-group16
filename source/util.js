/**
 * Converts a 24-hour time string to a 12-hour time string with AM/PM.
 * 
 * @function convertTo12Hour
 * @param {string} time - The time string in 24-hour format (HH:MM)
 * @returns {string|null} The time string in 12-hour format with AM/PM, or null if the input is invalid
 */
export function convertTo12Hour(time) {
    if (time == null || time == undefined) {
        return null;
    }
    let [hour, minute] = time.split(":");
    if (
        isNaN(hour) ||
        isNaN(minute) ||
        hour == undefined ||
        minute == undefined
    ) {
        return null;
    }
    hour = parseInt(hour, 10);

    let period = "AM";

    if (hour === 0) {
        hour = 12; // 12 AM
    } else if (hour === 12) {
        period = "PM"; // 12 PM
    } else if (hour > 12) {
        hour -= 12; // After 12 PM
        period = "PM";
    }

    return `${hour}:${minute} ${period}`;
}

/**
 * Generates a unique ID based on the current time.
 * 
 * @function getTimeBasedId
 * @returns {string} A unique ID string
 */
export function getTimeBasedId() {
    return String(new Date().getTime());
}
