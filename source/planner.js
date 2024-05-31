//planner.js
window.addEventListener('DOMContentLoaded', init);

function init(){
    const deleteButtons = document.querySelectorAll('.delete-button');
    const editButtons = document.querySelectorAll('.edit-button');
    const popupDelete = document.getElementById('popup-delete');
    const popupEdit = document.getElementById('edit-popup');
    const overlay = document.getElementById('overlay');
    const slider = document.getElementById('importance-slider');
    const switchToMonthlyButton = document.getElementById('switch-to-monthly');
    const switchToWeeklyButton = document.getElementById('switch-to-weekly');
    
    //Add Task Button//
    const addTaskButton = document.getElementById('add-task-button');
    const addTaskPopup = document.getElementById('add-task-popup');
    const addTaskConfirm = document.getElementById('add-task-confirm');
    const addTaskCancel = document.getElementById('add-task-cancel');

    // Insert the HTML structure for the add task popup
    document.body.insertAdjacentHTML('beforeend', `
    <div class="popup" id="add-task-popup">
        <h2>Add New Task</h2>
        <input type="text" id="new-task-title" placeholder="Task Title">
        <textarea id="new-task-description" placeholder="Task Description"></textarea>
        <div class="tags-container">
            <div class="tag">Tags</div>
            <div class="tag">Tags</div>
            <div class="tag">Tags</div>
            <button class="add-tag-button">+</button>
        </div>
        <input type="date" id="new-task-date">
        <input type="time" id="new-task-time">
        <div class="popup-buttons">
            <button class="popup-button-confirm" id="add-task-confirm">Add Task</button>
            <button class="popup-button-cancel" id="add-task-cancel">Cancel</button>
        </div>
    </div>
`   );

    // Event listener for opening the add task popup
    addTaskButton.addEventListener('click', () => {
        addTaskPopup.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Event listener for closing the add task popup
    addTaskCancel.addEventListener('click', () => {
        addTaskPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Event listener for adding a new task
    addTaskConfirm.addEventListener('click', () => {
        const title = document.getElementById('new-task-title').value;
        const description = document.getElementById('new-task-description').value;
        const date = new Date(document.getElementById('new-task-date').value);
        const time = convertTo12Hour(document.getElementById('new-task-time').value);

        if (title && description && date) {
            addNewTask(title, description, date, time);
            addTaskPopup.style.display = 'none';
            overlay.style.display = 'none';
        }
    });

    /**
     * Adds a new task to the task list and the calendar.
     * @param {string} title - The title of the task.
     * @param {string} description - The description of the task.
     * @param {Date} date - The due date of the task.
     * @param {string} time - The due time of the task.
     */
    function addNewTask(title, description, date, time) {
        const taskList = document.querySelector('.task-list ul');
        const calendarDays = document.querySelectorAll('.day');

        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div class="task-title">${title}</div>
            <div class="task-description">${description}</div>
        `;
        taskList.appendChild(taskItem);

        calendarDays.forEach(day => {
            const dayHeader = day.querySelector('header').textContent;
            const dayDate = new Date(dayHeader.split(' ')[1]);

            if (dayDate.toDateString() === date.toDateString()) {
                const eventItem = document.createElement('li');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <div class="event-title">${time ? `${time} - ` : ''}${title}</div>
                    <div class="event-description">${description}</div>
                    <div class="event-date">${formatDate(date)}</div>
                    <div class="event-completed">
                        <input type="checkbox"> Completed
                    </div>
                    <div class="hidden-slider-container">
                        <label for="importance-slider-hidden" class="slider-label">Importance (out of 100): </label>
                        <span id="slider-value-hidden">50</span>
                        <input type="range" class="slider" id="importance-slider-hidden" min="0" max="100" value="50">
                    </div>
                    <textarea class="hidden" id="event-notes" placeholder="Add notes"></textarea>
                    <div class="button-container">
                        <button class="edit-button">Edit</button>
                        <button class="delete-button">Delete</button>
                    </div>
                `;
                day.querySelector('ul').appendChild(eventItem);
                addEventListenersToTask(eventItem);
            }
        });

        addEventListenersToTask(taskItem);
    }

    /**
     * Adds event listeners to a task item.
     * @param {HTMLElement} task - The task item element.
     */
    function addEventListenersToTask(task) {
        const deleteButton = task.querySelector('.delete-button');
        const editButton = task.querySelector('.edit-button');

        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                currentTask = event.target.closest('.event-item');
                showPopupForDelete();
            });
        }

        if (editButton) {
            editButton.addEventListener('click', (event) => {
                currentTask = event.target.closest('.event-item');
                showPopupForEdit(currentTask);
            });
        }
    }
    /************ */
    let currentTask;
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentTask = event.target.closest('.event-item');
            showPopupForDelete();
        });
    });

    //brings up the popup for every edit button
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentTask = event.target.closest('.event-item');
            showPopupForEdit(currentTask);
        });
    });
    
    document.getElementById('confirm-delete').addEventListener('click', () => {
        currentTask.remove();
        hidePopupForDelete();
    });

    document.getElementById('cancel-delete').addEventListener('click', hidePopupForDelete);

    overlay.addEventListener('click', () => {
        hidePopupForDelete();
        hidePopupForEdit();
    });

    document.getElementById('save-edit').addEventListener('click', () => {
        const newTitle = document.getElementById('edit-title').value;
        const newDescription = document.getElementById('edit-description').value;
        const newDate = new Date(document.getElementById('edit-date').value);
        const newTime = convertTo12Hour(document.getElementById('edit-time').value);
        const newCompleted = document.getElementById('edit-completed').checked;
        const importance = document.getElementById('importance-slider').value;
        const newColor = document.getElementById('edit-color').value;
        const newNotes = document.getElementById('edit-notes').value;

        if(newTime == null){
            currentTask.querySelector('.event-title').textContent = newTitle;
        }
        else{
            currentTask.querySelector('.event-title').textContent = `${newTime} - ${newTitle}`;
        }
        currentTask.querySelector('.event-description').textContent = newDescription;
        currentTask.querySelector('.event-date').textContent = formatDate(newDate);
        currentTask.querySelector('.event-completed input').checked = newCompleted;
        currentTask.querySelector('#slider-value-hidden').textContent = importance;
        currentTask.querySelector('#event-notes').textContent = newNotes;
        currentTask.style.backgroundColor = newColor;
        popupEdit.style.backgroundColor = newColor;

        hidePopupForEdit();
    });

    document.getElementById('cancel-edit').addEventListener('click', hidePopupForEdit);

    function updateSliderValue(value) {
        document.getElementById('slider-value').textContent = value;
    }

    function showPopupForDelete() {
        popupDelete.style.display = 'block';
        overlay.style.display = 'block';
    }

    function showPopupForEdit(item) {
        //initialize everything from the task into variables
        const title = item.querySelector('.event-title').textContent;
        const description = item.querySelector('.event-description').textContent;
        const completed = item.querySelector('.event-completed input').checked;
        const dateString = item.querySelector('.event-date').textContent;
        const date = parseDate(dateString);
        const sliderValue = item.querySelector('#slider-value-hidden').textContent;
        const notes = item.querySelector('#event-notes').textContent;
        let [time, eventTitle] = title.split(' - ');
        popupEdit.style.backgroundColor = currentTask.style.backgroundColor;

        //for cases that do not have time specified, the time variable needs to switch with eventTitle
        if(eventTitle === undefined){
            eventTitle = time;
            time = null;
        }

        popupEdit.style.display = 'block';
        overlay.style.display = 'block';

        let color = window.getComputedStyle(popupEdit).backgroundColor;

        slider.addEventListener('change', () => {
            updateSliderValue(slider.value)
        });
        
        document.getElementById('edit-title').value = eventTitle;
        document.getElementById('edit-description').value =  description;
        document.getElementById('edit-completed').checked = completed;
        document.getElementById('edit-date').valueAsDate = date;
        document.getElementById('edit-time').value = convertTimeTo24Hour(time);
        document.getElementById('importance-slider').value = sliderValue;
        document.getElementById('slider-value').textContent = sliderValue;
        document.getElementById('edit-color').value = rgbToHex(color);
        document.getElementById('edit-notes').value = notes;
    }

    function hidePopupForDelete() {
        popupDelete.style.display = 'none';
        overlay.style.display = 'none';
        currentTask = null;
    }

    function hidePopupForEdit() {
        popupEdit.style.display = 'none';
        overlay.style.display = 'none';
        currentTask = null;
    }

    //turns am/pm into 24 hour time for html value so it can be edited
    function convertTimeTo24Hour(time) {
        if(time == null){
            return null;
        }
        const [hourMinute, period] = time.split(' ');
        let [hour, minute] = hourMinute.split(':');
        if(isNaN(hour) || isNaN(minute) || hour == undefined || minute == undefined){
            return null;
        }
        hour = parseInt(hour, 10);
        if (period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0;
        }
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    }

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

    //turns html value of the date into the format "mm.dd.yyyy" that the user will read
    function formatDate(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() returns zero-based month
        const day = (date.getDate() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${month}.${day}.${year}`;
    }

    //turns the format "mm.dd.yyyy" into an html value that can be used for the "date" input
    function parseDate(dateString) {
        const [month, day, year] = dateString.split('.');
        return new Date(`${year}-${month}-${day}`);
    }

    if (switchToMonthlyButton) {
        switchToMonthlyButton.addEventListener('click', () => {
            window.location.href = escape('monthly-planner.html');
        });
    }

    if (switchToWeeklyButton) {
        switchToWeeklyButton.addEventListener('click', () => {
            window.location.href = escape('planner.html');
        });
    }
  
    //turns rgb to hex for the input value of type color
    function rgbToHex(rgb) {
        let sep;
        if (rgb.indexOf(",") > -1) {
            sep = ",";
        } else {
            sep = " ";
        }
        const newRGB = rgb.substr(4).split(")")[0].split(sep);
        let r = (Number(newRGB[0])).toString(16),
            g = (Number(newRGB[1])).toString(16),
            b = (Number(newRGB[2])).toString(16);
        if (r.length === 1){
            r = "0" + r;
        }
        if (g.length === 1){
            g = "0" + g;
        }
        if (b.length === 1){
            b = "0" + b;
        }
        return "#" + r + g + b;
    }
}