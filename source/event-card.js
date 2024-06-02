//create custom event-card element from <li>
class eventCard extends HTMLElement {
    constructor() {
        super();
    }


    /**Set the properties of chlid elements of event-card
     * @param {Object} data
     */
    
    set data(data) {
        if (!data) return;
        this.innerHTML = '<div class="event-title">' + data.title + '</div>' +
        '<div class="event-description">' + data.description + '</div>' +
        '<div class="event-date">' + formatDate(data.date) + '</div>' +
        '<div class="event-completed"><input type="checkbox"' + isChecked(data.completion) + '></div>' +
        '<div class="hidden-slider-container"><label for="importance-slider-hidden" class="slider-label">Importance (out of 100): </label>' +
        '<span id="slider-value-hidden">' + data.importance + '</span>' +
        '<input type="range" class="slider" id="importance-slider-hidden" min="0" max="100" value=' + data.importance + '></div>' +
        '<div class="button-container"><button class="edit-button">Edit</button><button class="delete-button">Delete</button></div>' 
    }
}

customElements.define('event-card', eventCard);

function isChecked(status) {
    if(status == true) {
        return "checked";
    } else {
        return "";
    }
}

//turns html value of the date into the format "mm-dd-yyyy" that the user will read
function formatDate(date) {
    const dateObj = new Date(date);
    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() returns zero-based month
    let day = (dateObj.getDate() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    // Deals with date overflow, changes the date to the first of next month
    if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
        if (day == '32') {
            month = (dateObj.getMonth() + 2).toString().padStart(2, '0');
            day = '01'
        }
    } else if (month == '04' || month == '06' || month == '09' || month == '11') {
        if (day == '31') {
            month = (dateObj.getMonth() + 2).toString().padStart(2, '0');
            day = '01'
        }
    } else if (month == '02') {
        if (day == '29') {
            month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            day = '01'
            // @todo implement system for leap years
        }
    }

    return `${month}.${day}.${year}`;
}