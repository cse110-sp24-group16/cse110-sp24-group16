import { parser } from "./json-parser.js";
import { addChangeListener } from "./task-crud.js";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

window.addEventListener("DOMContentLoaded", init);

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

    curButton.addEventListener("click", () => {
        wipeCalendar();
        tday = date.getDate();
        tmonth = date.getMonth();
        tyear = date.getFullYear();
        makeCalendar(tday, tmonth, tyear);
    });

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

function checkTasks(day, month, year) {
    const tasks = parser.getTasks();
    let importance = 0;

    tasks.forEach(task => {
        const date = new Date(task["date"].replace(/-/g, '\/'));
        if (day === date.getDate() && month === date.getMonth() && year === date.getFullYear()) {
            importance += task["importance"];  // Assuming each task has an "importance" field
        }
    });

    return importance;
}

function makeCalendar(day, month, year) {
    const monthTitle = document.getElementById("month-title");
    const week = [
        document.getElementById("monday"),
        document.getElementById("tuesday"),
        document.getElementById("wednesday"),
        document.getElementById("thursday"),
        document.getElementById("friday"),
        document.getElementById("saturday"),
        document.getElementById("sunday"),
    ];
    const weekContainers = document.querySelectorAll(".day");
    const dayInd = new Date(year, month, day).getDay() - 1;
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
                monthText = `${months[month]} ${year} - ${months[0]} ${year + 1}`;
            } else {
                currMonth += 1;
                monthText = `${months[month]} - ${months[month + 1]} ${year}`;
            }
        } else if (currDate < 1) {
            currDate += lastMonthEnd;
            if (month === 0) {
                currMonth = 11;
                currYear -= 1;
                monthText = `${months[11]} ${year - 1} - ${months[month]} ${year}`;
            } else {
                currMonth -= 1;
                monthText = `${months[month - 1]} - ${months[month]} ${year}`;
            }
        }

        const ulElt = weekContainer.querySelector("ul");
        const importance = checkTasks(currDate, month, currYear);

        weekContainer.style.backgroundColor = calculateColor(importance);

        monthTitle.textContent = monthText;
        week[i].textContent = weekdays[i] + " " + currDate;
        weekContainers[i].id = `${currYear}-${currMonth.toString().padStart(2, "0")}-${currDate.toString().padStart(2, "0")}`;
    }
}

function wipeCalendar() {
    const weekContainers = document.querySelectorAll(".day");
    for (const weekContainer of weekContainers) {
        const ulElt = weekContainer.querySelector("ul");
        ulElt.innerHTML = "";
    }
}

function calculateColor(importance) {
    const maxImportance = 10;  // Adjust this based on your needs
    const blueComponent = Math.min(255, Math.floor((importance / maxImportance) * 255));
    return `rgb(${255 - blueComponent}, ${255 - blueComponent}, 255)`;
}
