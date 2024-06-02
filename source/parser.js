let fs = require('fs');
window.addEventListener('DOMContentLoaded', init);

function init() {
    //read json file from task.json
    try {
        let data = JSON.parse(fs.readFileSync('source/task.json', 'utf8'));
        fs.watch('source/task.json', (eventType, filename) => {
            if (eventType == 'change') {
                data = JSON.parse(fs.readFileSync('source/task.json', 'utf8'));
            }
        })
        const navButtonArr = document.querySelectorAll('.nav-button');
        const saveEditButton = document.getElementById('save-edit');
        const confirmDeleteButton = document.getElementById('confirm-delete');
        const weekdays = document.querySelectorAll('.day');

            //Tries to match dates to date of task; creates custom element if matches
            for (let i = 0; i < weekdays.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (weekdays[i].id == formatDate(data[j].date)) {
                        let eventCard = document.createElement('event-card');
                        eventCard.data = data[j];
                        eventCard.id = data[j].id;
                        weekdays[i].querySelector('ul').appendChild(eventCard);
                    }
                }
            }

        navButtonArr.forEach((button) => {
            //Listens for any click on all three of the nav-buttons
            button.addEventListener('click', () => {
                const tasks = document.querySelectorAll('event-card');
                tasks.forEach((task) => {
                    task.remove();
                });

                const weekdays = document.querySelectorAll('.day');

                //Tries to match dates to date of task; creates custom element if matches
                for (let i = 0; i < weekdays.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (weekdays[i].id == formatDate(data[j].date)) {
                            let eventCard = document.createElement('event-card');
                            eventCard.data = data[j];
                            eventCard.id = data[j].id;
                            weekdays[i].querySelector('ul').appendChild(eventCard);
                        }
                    }
                }
            })
        });

        saveEditButton.addEventListener('click', () => {
            setTimeout(() => {
                const tasks = document.querySelectorAll('event-card');
                tasks.forEach((task) => {
                    task.remove();
                });

                const weekdays = document.querySelectorAll('.day');

                //Tries to match dates to date of task; creates custom element if matches
                for (let i = 0; i < weekdays.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (weekdays[i].id == formatDate(data[j].date)) {
                            let eventCard = document.createElement('event-card');
                            eventCard.data = data[j];
                            eventCard.id = data[j].id;
                            weekdays[i].querySelector('ul').appendChild(eventCard);
                        }
                    }
                }
            }, 100);
        });

        confirmDeleteButton.addEventListener('click', () => {
            setTimeout(() => {
                const tasks = document.querySelectorAll('event-card');
                tasks.forEach((task) => {
                    task.remove();
                });

                const weekdays = document.querySelectorAll('.day');

                //Tries to match dates to date of task; creates custom element if matches
                for (let i = 0; i < weekdays.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (weekdays[i].id == formatDate(data[j].date)) {
                            let eventCard = document.createElement('event-card');
                            eventCard.data = data[j];
                            eventCard.id = data[j].id;
                            weekdays[i].querySelector('ul').appendChild(eventCard);
                        }
                    }
                }
            }, 100);
        });
    
    //catch block in case task.json doesn't exist
    } catch (err) {
        //create json array with hard-coded data on browser
        let taskJson = [];
        const weekdays = document.querySelectorAll('.day');
        for (let i = 0; i < weekdays.length; i++) {
            let tasks = weekdays[i].querySelectorAll('.event-item');
            let id = 0;
            tasks.forEach((task) => {
                let dailyTasks = {};
                dailyTasks['title'] = task.querySelector('.event-title').innerHTML;
                dailyTasks['description'] = task.querySelector('.event-description').innerHTML;
                dailyTasks['date'] = parseDate(task.querySelector('.event-date').innerHTML);
                dailyTasks['completion'] = task.querySelector('.event-completed > input').checked;
                dailyTasks['importance'] = task.querySelector('.hidden-slider-container > input').value;
                dailyTasks['id'] = id;
                taskJson.push(dailyTasks);
                id++;
                task.remove();
            })
        }

        //write taskJson to task.json
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

//turns html value of the date into the format "yyyy-mm-dd" that the user will read
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

    return `${year}-${month}-${day}`;
}

//turns the format "mm.dd.yyyy" into an html value that can be used for the "date" input
function parseDate(dateString) {
    const [month, day, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}`);
}