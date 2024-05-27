let fs = require('fs');
window.addEventListener('DOMContentLoaded', init);

function init() {
    try {
        const data = JSON.parse(fs.readFileSync('source/task.json', 'utf8'));
        const weekdays = document.querySelectorAll('.day');

        for (let i = 0; i < weekdays.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (weekdays[i].id == formatDate(data[j].date)) {
                    let eventCard = document.createElement('event-card');
                    eventCard.data = data[j];
                    weekdays[i].querySelector('ul').appendChild(eventCard);
                }
            }
        }
        
    } catch (err) {
        let taskJson = [];
        const weekdays = document.querySelectorAll('.day');
        for (let i = 0; i < weekdays.length; i++) {
            let tasks = weekdays[i].querySelectorAll('.event-item');
            tasks.forEach((task) => {
                let dailyTasks = {};
                dailyTasks['title'] = task.querySelector('.event-title').innerHTML;
                dailyTasks['description'] = task.querySelector('.event-description').innerHTML;
                dailyTasks['date'] = parseDate(task.querySelector('.event-date').innerHTML);
                dailyTasks['completion'] = task.querySelector('.event-completed > input').checked;
                dailyTasks['importance'] = task.querySelector('.hidden-slider-container > input').value;
                taskJson.push(dailyTasks);
            })
        }

        try {
            fs.writeFileSync('source/task.json', JSON.stringify(taskJson));
        } catch (err) {
            console.log(err);
        }
    }
}


//Following functions copied from planner.js
//turns html value of time into am/pm so it can be read easily the user
function convertTo12Hour(time) {
    if(time == null ||time == undefined){
        return null;
    }
    let [hour, minute] = time.split(':');
    if(isNaN(hour) || isNaN(minute) || hour == undefined || minute == undefined){
        return null;
    }
    hour = parseInt(hour, 10);
    
    let period = 'AM';
    
    if (hour === 0) {
        hour = 12; // 12 AM
    } else if (hour === 12) {
        period = 'PM'; // 12 PM
    } else if (hour > 12) {
        hour -= 12; // After 12 PM
        period = 'PM';
    }

    return `${hour}:${minute} ${period}`;
}

//turns html value of the date into the format "mm-dd-yyyy" that the user will read
function formatDate(date) {
    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() returns zero-based month
    const day = (dateObj.getDate() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
}

//turns the format "mm.dd.yyyy" into an html value that can be used for the "date" input
function parseDate(dateString) {
    const [month, day, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}`);
}