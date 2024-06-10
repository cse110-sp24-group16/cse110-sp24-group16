const { parser } = require("./json-parser.js");
const { mdParser } = require("./md-parser.js");
const { showPopupForMarkdown } = require("./md-crud.js");
const { showPopupForEdit, addChangeListener, showPopupForDelete } = require("./task-crud.js");

const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

window.addEventListener('DOMContentLoaded', init);

/**
 * Initializes the calendar and sets up event listeners for navigation buttons.
 * 
 * @name calendar-init
 * @function init
 */
function init() {
    /**
     * Callback function for change listener to update the calendar.
     * 
     * @name changeListenerCallback
     * @function
     */
    addChangeListener(() => {
        wipeCalendar();
        makeCalendar(month, year);
    });

    const prevButton = document.querySelector("#prev-button");
    const curButton = document.querySelector("#cur-button");
    const nextButton = document.querySelector("#next-button");


    makeCalendar(month, year);

    /**
     * Event handler for the next button to move to the next month.
     * 
     * @name nextButtonClickHandler
     * @function
     */
    nextButton.addEventListener("click", () => {
      wipeCalendar();
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      makeCalendar(month, year);
    });
    
    /**
     * Event handler for the previous button to move to the previous month.
     * 
     * @name prevButtonClickHandler
     * @function
     */
    prevButton.addEventListener("click", () => {
        wipeCalendar();
        month -= 1;
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        makeCalendar(month, year);
    });
    
    /**
     * Event handler for the current button to move to the current month.
     * 
     * @name curButtonClickHandler
     * @function
     */
    curButton.addEventListener("click", () => {
        wipeCalendar();
        month = date.getMonth();
        year = date.getFullYear();
        makeCalendar(month, year);
    });
}

/**
 * Checks if the given date is today and adds an id to the element if true.
 * 
 * @function checkToday
 * @param {HTMLElement} liElt - The list item element representing the date.
 * @param {number} day - The day of the month.
 * @param {number} month - The month (0-11).
 * @param {number} year - The full year.
 */
function checkToday(liElt, day, month, year) {
    if (
        day === date.getDate() &&
        month === date.getMonth() &&
        year === date.getFullYear()
    ) {
        liElt.id = "today";
    }
}

/**
 * Checks for tasks on the given date and appends them to the provided list element.
 * 
 * @function checkTasks
 * @param {HTMLElement} ulElt - The unordered list element to append tasks to.
 * @param {number} day - The day of the month.
 * @param {number} month - The month (0-11).
 * @param {number} year - The full year.
 */
function checkTasks(ulElt, day, month, year) {
    parser.getTasks().forEach((task) => {
        const date = new Date(task["date"].replace(/-/g, '/'));

        if (
            day === date.getDate() &&
            month === date.getMonth() &&
            year === date.getFullYear()
        ) {
            const liElt = document.createElement("li");
            liElt.className = "task";
            liElt.style.backgroundColor = task.color;
            liElt.textContent = `${task["title"]}`;
            
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation(); 
                showPopupForDelete(task.id); 
            });
            liElt.appendChild(deleteButton);
            
            liElt.addEventListener("click", () => {
                showPopupForEdit(task.id);
            });
            ulElt.appendChild(liElt);
        }
    });
}

/**
 * Event handler for hovering over a day to highlight it.
 * 
 * @name dayHoverHandler
 * @function
 * @param {HTMLElement} liElt - The list item element representing the date.
 */
function dayHoverHandler(liElt) {
    liElt.addEventListener('mouseenter', function() {
        liElt.classList.add('day-hover');
    });

    liElt.addEventListener('mouseleave', function() {
        liElt.classList.remove('day-hover');
    });
}

/**
 * Creates a calendar date entry for the specified day, month, and year, and populates it with tasks.
 * 
 * @function createDateEntry
 * @param {number} day - The day of the month.
 * @param {number} month - The month (0-11).
 * @param {number} year - The full year.
 * @param {boolean} extra - Whether the date is an extra day (from the previous or next month).
 */
function createDateEntry(day, month, year, extra) {
    const calendar = document.querySelector("#calendar");
    const liElt = document.createElement("li");
    liElt.tabIndex = "0";
    const spanElt = document.createElement("span");
    spanElt.className = "day-number";
    liElt.appendChild(spanElt);
    calendar.appendChild(liElt);
    liElt.className = !extra ? "day" : "day-extra";
    spanElt.textContent = `${day}`;

     // Check if the day is a weekend
     const date = new Date(year, month, day);
     const dayOfWeek = date.getDay();
     if (dayOfWeek === 0 || dayOfWeek === 6) {
         liElt.classList.add("weekend");
     }

         // Add hover effect
    dayHoverHandler(liElt);
    
    const ulElt = document.createElement("ul");
    ulElt.className = "task-list";
    ulElt.classList.add("ul");
    liElt.appendChild(ulElt);
    checkToday(liElt, day, month, year);
    checkTasks(ulElt, day, month, year);
    
    const dateStr = date.toISOString().split('T')[0];
    const hasJournal = mdParser.hasJournal(dateStr);
    const container = document.createElement('div');
    container.className = 'journal-container';
    container.hidden = !hasJournal;

    const img = document.createElement('img');
    img.src = './assets/journal-icon.png';
    img.alt = 'Journal';
    img.className = 'journal-button';

    img.addEventListener('click', () => {
        showPopupForMarkdown(dateStr);
    });

    container.appendChild(img);
    liElt.prepend(container); // Prepend container to liElt

    liElt.addEventListener('mouseover', () => {
        container.hidden = false;
    });

    liElt.addEventListener('mouseleave', () => {
        if (!mdParser.hasJournal(dateStr)) {
            container.hidden = true;
        }
    });
}

/**
 * Generates the calendar for the specified month and year.
 * given month and year, make the monthly view
 * populate the calendar with buckets (li elements)
 * 
 * @function makeCalendar
 * @param {number} month - The month (0-11).
 * @param {number} year - The full year.
 */
function makeCalendar(month, year) {
    const monthTitle = document.querySelector("#month-title");
    monthTitle.textContent = `${months[month | 0]} ${year | 0}`;
    const startDate = new Date(year, month, 1);
    //returns the day of the week of the first day
    const start = startDate.getDay();
    //returns the last day number
    const endDate = new Date(year, month + 1, 0).getDate();
    //returns the day of the week of the last day
    const end = new Date(year, month, endDate).getDay();
    //returns the last months last day
    const endDatePrev = new Date(year, month, 0).getDate();
    //buckets for extra day at start
    for (let i = start; i > 0; i--) {
        const day = endDatePrev - i + 1;
        var prevMo = new Date(startDate.getTime());
        prevMo.setDate(0);
        createDateEntry(day, prevMo.getMonth(), prevMo.getFullYear(), true);
    }

    //buckets for months days
    for (let i = 1; i < endDate + 1; i++) {
        const day = i;
        createDateEntry(day, month, year, false);
    }

    //buckets for extra days at end
    for (let i = end; i < 6; i++) {
        const day = i - end + 1;
        var nextMo = new Date(startDate.getTime());
        nextMo.setMonth(nextMo.getMonth() + 1, 1);
        createDateEntry(day, nextMo.getMonth(), nextMo.getFullYear(), true);
    }
}

/**
 * Clears the calendar by removing all day and day-extra elements.
 * 
 * @function wipeCalendar
 */
function wipeCalendar() {
    const exdays = document.querySelectorAll(".day-extra");
    const days = document.querySelectorAll(".day");
    const dayNames = document.querySelectorAll(".day-name"); // Add this line to select day name headers

    for (const exday of exdays) {
        if (exday instanceof HTMLElement) {
            exday.parentNode.removeChild(exday);
        }
    }
    for (const day of days) {
        if (day instanceof HTMLElement) {
            day.parentNode.removeChild(day);
        }
    }
}
