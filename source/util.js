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

// Function to generate a unique id based on the current time
export function getTimeBasedId() {
    return String(new Date().getTime());
}