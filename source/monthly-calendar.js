import { parser } from "./json-parser.js";
import { showPopupForEdit, addChangeListener } from "./task-crud.js";

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

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

window.addEventListener('DOMContentLoaded', init);

function init() {
    addChangeListener(() => {
        wipeCalendar();
        makeCalendar(month, year);
    });

    const prevButton = document.querySelector("#prev-button");
    const curButton = document.querySelector("#cur-button");
    const nextButton = document.querySelector("#next-button");

    makeCalendar(month, year);

    nextButton.addEventListener("click", () => {
      wipeCalendar();
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      makeCalendar(month, year);
    });
    
    prevButton.addEventListener("click", () => {
        wipeCalendar();
        month -= 1;
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        makeCalendar(month, year);
    });
    
    curButton.addEventListener("click", () => {
        wipeCalendar();
        month = date.getMonth();
        year = date.getFullYear();
        makeCalendar(month, year);
    });
}


function checkToday(liElt, day, month, year) {
    if (
        day === date.getDate() &&
        month === date.getMonth() &&
        year === date.getFullYear()
    ) {
        liElt.id = "today";
    }
}

function checkTasks(ulElt, day, month, year) {
    parser.getTasks().forEach((task) => {
        const date = new Date(task["date"]);

        if (
            day === date.getDate() &&
            month === date.getMonth() &&
            year === date.getFullYear()
        ) {
            const liElt = document.createElement("li");
            liElt.className = "task";
            liElt.style.backgroundColor = task.color;
            liElt.textContent = `${task["title"]}`;
            liElt.addEventListener("click", () => {
                showPopupForEdit(task.id);
            });
            ulElt.appendChild(liElt);
        }
    });
}

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

    const ulElt = document.createElement("ul");
    ulElt.className = "task-list";
    liElt.appendChild(ulElt);
    checkToday(liElt, day, month, year);
    checkTasks(ulElt, day, month, year);
}

//given month and year, make the monthly view
//populate the calendar with buckets (li elements)
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

//erases the calendar
function wipeCalendar() {
    let exdays = document.querySelectorAll(".day-extra");
    let days = document.querySelectorAll(".day");

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