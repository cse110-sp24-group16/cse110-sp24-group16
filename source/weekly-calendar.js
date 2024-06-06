import { parser } from "./json-parser.js";
import { addChangeListener } from "./task-crud.js";

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
const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

window.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the weekly calendar view and sets up event listeners for navigation buttons.
 * 
 * @name weekly-init
 * @function init
 */
function init() {
    addChangeListener(() => {
        wipeCalendar();
        makeCalendar(tday, tmonth, tyear);
    });
    
    const prevButton = document.querySelector("#prev-button");
    const curButton = document.querySelector("#cur-button");
    const nextButton = document.querySelector("#next-button");
    let date = new Date();
    let tday = date.getDate();
    let tmonth = date.getMonth();
    let tyear = date.getFullYear();

    makeCalendar(tday, tmonth, tyear);

    /**
     * Event listener for navigating to the next week.
     * 
     * @name nextButtonClickListener
     * @function
     */
    nextButton.addEventListener("click", () => {
        wipeCalendar();

        let tmonthEnd = new Date(tyear, tmonth + 1, 0).getDate();
        tday += 7;
        if (tday > tmonthEnd) {
            tday -= tmonthEnd;
            tmonth += 1;
            if (tmonth > 11) {
                tmonth = 0;
                tyear += 1;
            }
        }
        makeCalendar(tday, tmonth, tyear);
    });

    /**
     * Event listener for navigating to the current week.
     * 
     * @name curButtonClickListener
     * @function
     */
    curButton.addEventListener("click", () => {
        wipeCalendar();
        tday = date.getDate();
        tmonth = date.getMonth();
        tyear = date.getFullYear();
        makeCalendar(tday, tmonth, tyear);
    });

    /**
     * Event listener for navigating to the previous week.
     * 
     * @name prevButtonClickListener
     * @function
     */
    prevButton.addEventListener("click", () => {
        wipeCalendar();

        let tlastMonthEnd = new Date(tyear, tmonth, 0).getDate();
        tday -= 7;
        if (tday < 1) {
            tday += tlastMonthEnd;
            tmonth -= 1;
            if (tmonth < 0) {
                tmonth = 11;
                tyear -= 1;
            }
        }
        makeCalendar(tday, tmonth, tyear);
    });
}

/**
 * Checks for tasks on a given date and adds them to the provided list element.
 * 
 * @function checkTasks
 * @param {HTMLElement} ulElt - The unordered list element to append tasks to.
 * @param {number} day - The day of the month.
 * @param {number} month - The month (0-11).
 * @param {number} year - The full year.
 */
function checkTasks(ulElt, day, month, year) {
    parser.getTasks().forEach((task) => {
        const date = new Date(task["date"].replace(/-/g, '\/'));

        if (
            day === date.getDate() &&
            month === date.getMonth() &&
            year === date.getFullYear()
        ) {
            let eventCard = document.createElement("event-card");
            eventCard.data = task;
            ulElt.appendChild(eventCard);
        }
    });
}

/**
 * Generates the weekly calendar view for the specified day, month, and year.
 * 
 * @function makeCalendar
 * @param {number} day - The starting day of the week.
 * @param {number} month - The month (0-11).
 * @param {number} year - The full year.
 */
function makeCalendar(day, month, year) {
    const monthTitle = document.getElementById("month-title");
    const week = [
        document.getElementById("sunday"),
        document.getElementById("monday"),
        document.getElementById("tuesday"),
        document.getElementById("wednesday"),
        document.getElementById("thursday"),
        document.getElementById("friday"),
        document.getElementById("saturday"),
    ];
    const weekContainers = document.querySelectorAll(".day");
    const dayInd = new Date(year, month, day).getDay();
    const monthEnd = new Date(year, month + 1, 0).getDate();
    const lastMonthEnd = new Date(year, month, 0).getDate();
    let monthText = months[`${month}`] + " " + year;

    for (let i = 0; i < 7; i++) {
        const weekContainer = weekContainers[i];
        let currDate = day - dayInd + i;
        let currMonth = month + 1;
        let currYear = year;

        if (currDate > monthEnd) {
            currDate -= monthEnd;

            if (month === 11) {
                currMonth = 0;
                currYear += 1;
                monthText = `${months[month]} ${year} - ${months[0]} ${
                    year + 1
                }`;
            } else {
                currMonth += 1;
                monthText = `${months[month]} - ${months[month + 1]} ${year}`;
            }
        } else if (currDate < 1) {
            currDate += lastMonthEnd;

            if (month === 0) {
                currMonth = 11;
                currYear -= 1;
                monthText = `${months[11]} ${year - 1} - ${
                    months[month]
                } ${year}`;
            } else {
                currMonth -= 1;
                monthText = `${months[month - 1]} - ${months[month]} ${year}`;
            }
        }

        const ulElt = weekContainer.querySelector("ul");

        checkTasks(ulElt, currDate, month, currYear);

        monthTitle.textContent = monthText;
        week[i].textContent = weekdays[i] + " " + currDate;
        weekContainers[i].id = `${currYear}-${currMonth
            .toString()
            .padStart(2, "0")}-${currDate.toString().padStart(2, "0")}`;
    }
}

/**
 * Clears the weekly calendar view by removing all task elements.
 * 
 * @function wipeCalendar
 */
function wipeCalendar() {
    const weekContainers = document.querySelectorAll(".day");

    for (const weekContainer of weekContainers) {
        const ulElt = weekContainer.querySelector("ul");
        ulElt.innerHTML = "";
    }
}
