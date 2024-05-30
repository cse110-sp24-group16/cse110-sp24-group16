window.addEventListener('DOMContentLoaded', init);

function init(){
    let monthTitle = document.getElementById("month-title");
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
    let week = [document.getElementById("monday"),
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

    function getWeek(day, month, year) {
        monthTitle.textContent = months[month] + " " + year;
        const dayInd = new Date(year, month, day).getDay() - 1;
        const monthEnd = new Date(year, month + 1, 0).getDate();
        const lastMonthEnd = new Date(year, month, 0).getDate();
        console.log(dayInd);
        console.log(monthEnd);
        for (let i = 0; i < 7; i++){
            let currDate = day - dayInd + i;
            if (currDate >= 1 && currDate <= monthEnd){
                week[i].textContent = weekdays[i] + " " + currDate;
            }
            else if (currDate > monthEnd){
                week[i].textContent = weekdays[i] + " " + (currDate - monthEnd);
                monthTitle.textContent = months[month] + " - " + months[month + 1] + " " + year;
            }
            else{
                week[i].textContent = weekdays[i] + " " + (lastMonthEnd + currDate);
                monthTitle.textContent = months[month - 1] + " - " + months[month] + " " + year;
            }
        }
    }

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

    prevButton.addEventListener("click", () => {
        let tlastMonthEnd = new Date(tyear, tmonth, 0).getDate();
        tday -= 7;
        if(tday < 1){
            tday += tlastMonthEnd;
            tmonth -= 1;
            if (tmonth < 11) {
                tmonth = 11;
                tyear -= 1;
            }
        }
        getWeek(tday, tmonth, tyear);
    });

    curButton.addEventListener("click", () => {
        tday = date.getDate();
        tmonth = date.getMonth();
        tyear = date.getFullYear();
        getWeek(tday, tmonth, tyear);
    });
    
}