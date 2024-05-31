window.addEventListener('DOMContentLoaded', init);

function init(){
    const monthTitle = document.getElementById("month-title");
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
    const week = [document.getElementById("monday"),
        document.getElementById("tuesday"),
        document.getElementById("wednesday"),
        document.getElementById("thursday"),
        document.getElementById("friday"),
        document.getElementById("saturday"),
        document.getElementById("sunday"),
    ];
    const prevButton = document.querySelector("#prevButton");
    const curButton = document.querySelector("#curButton");
    const nextButton = document.querySelector("#nextButton");
    let weekdays = ["Monday", 
        "Tuesday", 
        "Wednesday", 
        "Thursday", 
        "Friday", 
        "Saturday", 
        "Sunday"
    ];
    let date = new Date();
    let tday = date.getDate();
    let tmonth = date.getMonth();
    let tyear = date.getFullYear();

    getWeek(tday,tmonth,tyear);

    //Change the week's dates according to the day, month, year pass to it.
    //update the month title accordingly, 
    //if week shows more than one month, display both months,
    //if more than one year, display both years
    //return a list of date objects for each day of the week
    function getWeek(day, month, year) {
        const dayInd = new Date(year, month, day).getDay() - 1;
        const monthEnd = new Date(year, month + 1, 0).getDate();
        const lastMonthEnd = new Date(year, month, 0).getDate();
        const weekId = [];
        let monthText = months[`${month}`] + " " + year;;
        for (let i = 0; i < 7; i++){
            let currDate = day - dayInd + i;
            let currMonth = month;
            let currYear = year;
            if (currDate > monthEnd){
                currDate -= monthEnd;
                if (month === 11){
                    currMonth = 0;
                    currYear += 1;
                    monthText = `${months[`${month}`]} ${year} - ${months[`${0}`]} ${year + 1}`;
                }
                else{
                    currMonth += 1;
                    monthText = `${months[`${month}`]} - ${months[`${month + 1}`]} ${year}`;
                }
            }
            else if (currDate < 1){
                currDate += lastMonthEnd;
                if (month === 0){
                    currMonth = 11;
                    currYear -= 1;
                    monthText = `${months[`${11}`]} ${year - 1} - ${months[`${month}`]} ${year}`;
                }
                else{
                    currMonth -= 1;
                    monthText = `${months[`${month - 1}`]} - ${months[`${month}`]} ${year}`;
                }
            }
            monthTitle.textContent = monthText;
            week[`${i}`].textContent = weekdays[`${i}`] + " " + currDate;
            weekId.push(new Date(currYear, currMonth, currDate));
        }
        return weekId;
    }

    //on pressing the next button, will change to the next week
    nextButton.addEventListener("click", () => {
        let tmonthEnd = new Date(tyear, tmonth + 1, 0).getDate();
        tday += 7;
        if(tday > tmonthEnd){
            tday -= tmonthEnd;
            tmonth += 1;
            if (tmonth > 11) {
                tmonth = 0;
                tyear += 1;
            }
        }
        getWeek(tday, tmonth, tyear);
    });

    //on pressing the previous button, will change to the previous week
    prevButton.addEventListener("click", () => {
        let tlastMonthEnd = new Date(tyear, tmonth, 0).getDate();
        tday -= 7;
        if(tday < 1){
            tday += tlastMonthEnd;
            tmonth -= 1;
            if (tmonth < 0) {
                tmonth = 11;
                tyear -= 1;
            }
        }
        getWeek(tday, tmonth, tyear);
    });

    //on pressing the today button, well bring you back to today's week
    curButton.addEventListener("click", () => {
        tday = date.getDate();
        tmonth = date.getMonth();
        tyear = date.getFullYear();
        getWeek(tday, tmonth, tyear);
    });
    
}