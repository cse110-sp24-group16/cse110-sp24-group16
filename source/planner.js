//planner.js
window.addEventListener('DOMContentLoaded', init);

function init(){
    const deleteButtons = document.querySelectorAll('.delete-button');
    const editButtons = document.querySelectorAll('.edit-button');
    const popupDelete = document.getElementById('popup-delete');
    const popupEdit = document.getElementById('edit-popup');
    const overlay = document.getElementById('overlay');
    const slider = document.getElementById('importance-slider');
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