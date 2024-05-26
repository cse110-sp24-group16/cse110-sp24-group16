const month_header = document.querySelector(".month-title");
const calendar = document.querySelector("#calendar");
const prevButton = document.querySelector("#prevButton");
const curButton = document.querySelector("#curButton");
const nextButton = document.querySelector("#nextButton");
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
    "December"
];
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

//given month and year, make the monthly view
//populate the calendar with buckets (li elements)
function makeCalendar(month, year){
    month_header.innerText = `${months[month]} ${year}`;
    //returns the day of the week of the first day
    const start = new Date(year, month, 1).getDay();
    //returns the last day number
    const endDate = new Date(year, month + 1, 0).getDate();
    //returns the day of the week of the last day
    const end = new Date(year, month, endDate).getDay();
    //returns the last months last day
    const endDatePrev = new Date(year, month, 0).getDate();
    //buckets for extra day at start
    for (let i = start; i > 0; i--){
        makeBucket(i, month, year);
        liElt.className = "day-extra";
        spanElt.innerText = `${endDatePrev - i + 1}`;
    }
    //buckets for months days
    for (let i = 1; i < endDate + 1; i++) {
        makeBucket(i, month, year);
        liElt.className = "day";
        spanElt.innerText = `${i}`;
        if (i === 1){liElt.id = "first-day";}
    }
    //buckets for extra days at end
    for (let i = end; i < 6; i++){
        makeBucket(i, month, year);
        spanElt.innerText = `${i - end + 1}`;
        liElt.className = "day-extra";
    }
}

//helper function to make a li html element.
//span nested in li element
function makeBucket(i, month, year){
    liElt = document.createElement("li");
    if (i === date.getDate() && month === date.getMonth() && year === date.getFullYear()){
        liElt.id = "today";}
    liElt["tabindex"] = "0";
    spanElt = document.createElement("span");
    spanElt.className = "day-number";
    liElt.appendChild(spanElt);
    calendar.appendChild(liElt);
}

//erases the calendar
function wipeCalendar(){
    let dayes = document.querySelectorAll(".day-extra");
    let days = document.querySelectorAll(".day");

    for(let i = 0; i < dayes.length; i++){
        dayes[i].remove();
    }
    for(let i = 0; i < days.length; i++){
        days[i].remove();
    }
}


makeCalendar(month, year);
nextButton.addEventListener("click", () => {
    wipeCalendar();
    month += 1;
    if (month > 11){
        month = 0;
        year += 1;
    }
    makeCalendar(month, year);
});

prevButton.addEventListener("click", () => {
    wipeCalendar();
    month -= 1;
    if (month < 0){
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

