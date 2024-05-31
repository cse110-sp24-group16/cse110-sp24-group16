<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Calendar</title>
    <style>
        #calendar div {
            padding: 5px;
            margin: 5px;
            border: 1px solid #ccc;
            display: inline-block;
            width: 100px;
        }
        button, input[type="date"] {
            margin: 10px;
        }
    </style>
</head>
<body>
    <h1 id="month-title"></h1>
    <div id="calendar">
        <div id="monday"></div>
        <div id="tuesday"></div>
        <div id="wednesday"></div>
        <div id="thursday"></div>
        <div id="friday"></div>
        <div id="saturday"></div>
        <div id="sunday"></div>
    </div>
    <button id="prevButton">Previous Week</button>
    <button id="curButton">Today</button>
    <button id="nextButton">Next Week</button>
    <input type="date" id="datePicker">
    <script>
        window.addEventListener('DOMContentLoaded', init);

        function init() {
            const monthTitle = document.getElementById("month-title");
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const week = [
                document.getElementById("monday"),
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
            const datePicker = document.querySelector("#datePicker");
            let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            let date = new Date();
            let tday = date.getDate();
            let tmonth = date.getMonth();
            let tyear = date.getFullYear();

            getWeek(tday, tmonth, tyear);

            function getWeek(day, month, year) {
                const dayInd = new Date(year, month, day).getDay() - 1;
                const monthEnd = new Date(year, month + 1, 0).getDate();
                const lastMonthEnd = new Date(year, month, 0).getDate();
                const weekId = [];
                let monthText = months[month] + " " + year;
                for (let i = 0; i < 7; i++) {
                    let currDate = day - dayInd + i;
                    let currMonth = month;
                    let currYear = year;
                    if (currDate > monthEnd) {
                        currDate -= monthEnd;
                        if (month === 11) {
                            currMonth = 0;
                            currYear += 1;
                            monthText = `${months[month]} ${year} - ${months[0]} ${year + 1}`;
                        } else {
                            currMonth += 1;
                            monthText = `${months[month]} - ${months[currMonth]} ${year}`;
                        }
                    } else if (currDate < 1) {
                        currDate += lastMonthEnd;
                        if (month === 0) {
                            currMonth = 11;
                            currYear -= 1;
                            monthText = `${months[11]} ${year - 1} - ${months[month]} ${year}`;
                        } else {
                            currMonth -= 1;
                            monthText = `${months[currMonth]} - ${months[month]} ${year}`;
                        }
                    }
                    monthTitle.textContent = monthText;
                    week[i].textContent = weekdays[i] + " " + currDate;
                    weekId.push(new Date(currYear, currMonth, currDate));
                }
                return weekId;
            }

            nextButton.addEventListener("click", () => {
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
                getWeek(tday, tmonth, tyear);
            });

            prevButton.addEventListener("click", () => {
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
                getWeek(tday, tmonth, tyear);
            });

            curButton.addEventListener("click", () => {
                tday = date.getDate();
                tmonth = date.getMonth();
                tyear = date.getFullYear();
                getWeek(tday, tmonth, tyear);
            });

            datePicker.addEventListener("change", (event) => {
                const selectedDate = new Date(event.target.value);
                tday = selectedDate.getDate();
                tmonth = selectedDate.getMonth();
                tyear = selectedDate.getFullYear();
                getWeek(tday, tmonth, tyear);
            });
        }
    </script>
</body>
</html>
