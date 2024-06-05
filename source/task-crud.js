//planner.js
import {
    getTimeBasedId
} from "./util.js";
import { parser } from "./json-parser.js";

const changeListeners = [];

export function addChangeListener(listener) {
    changeListeners.push(listener);
}

function notifyChangeListeners() {
    changeListeners.forEach((listener) => listener());
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const overlay = document.getElementById("overlay");

    const popupDelete = document.getElementById("popup-delete");
    const popupEdit = document.getElementById("edit-popup");
    const slider = document.getElementById("importance-slider");
    slider.addEventListener("input", () => {
        document.getElementById("slider-value").textContent = slider.value;
    });

    const addTaskButton = document.getElementById("add-button");
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskConfirm = document.getElementById("add-task-confirm");
    const addTaskCancel = document.getElementById("add-task-cancel");

    const deleteTaskConfirm = document.getElementById("confirm-delete");
    const deleteTaskCancel = document.getElementById("cancel-delete");

    const editTaskConfirm = document.getElementById("save-edit");
    const editTaskCancel = document.getElementById("cancel-edit");

    // Event listener for opening the add new task popup
    addTaskButton.addEventListener("click", () => {
        addTaskPopup.style.display = "block";
        overlay.style.display = "block";
    });

    // Event listener for closing the add new task popup
    addTaskCancel.addEventListener("click", () => {
        addTaskPopup.style.display = "none";
        overlay.style.display = "none";
    });

    // Event listener for adding a new task
    addTaskConfirm.addEventListener("click", () => {
        // Get the values from the input fields
        const title = document.getElementById("new-task-title").value;
        const description = document.getElementById("new-task-description").value;
        const date = document.getElementById("new-task-date").value;
        const time = document.getElementById("new-task-time").value;

        if (title && description && date && time) {
            const task = {
                id: getTimeBasedId(),
                title: title,
                description: description,
                date: date,
                time: time,
                completed: false,
                importance: 0,
                color: '#d8e5e8',
                notes: '',
            };
            
            parser.addTask(task);
            notifyChangeListeners();

            // Disable pop-up after adding task
            addTaskPopup.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // Event listener for confirming the task deletion
    deleteTaskConfirm.addEventListener("click", () => {
        const id = popupDelete.dataset.id;
        parser.deleteTask(id);
        notifyChangeListeners();

        // Disable pop-up after deleting task
        hidePopupForDelete();
    });

    // Event listener for canceling the task deletion
    deleteTaskCancel.addEventListener("click", hidePopupForDelete);

    function hidePopupForDelete() {
        popupDelete.style.display = "none";
        overlay.style.display = "none";
    }
    
    function hidePopupForEdit() {
        popupEdit.style.display = "none";
        overlay.style.display = "none";
    }

    editTaskConfirm.addEventListener("click", () => {
        const id = popupEdit.dataset.id;
        parser.deleteTask(id);

        const task = {};
        task["title"] = document.getElementById("edit-title").value;
        task["description"] = document.getElementById("edit-description").value;
        task["completed"] = document.getElementById("edit-completed").checked;
        task["date"] = document.getElementById("edit-date").value;
        task["time"] = document.getElementById("edit-time").value;
        task["importance"] = document.getElementById("importance-slider").value / 100;
        task["color"] = document.getElementById("edit-color").value;
        task["notes"] = document.getElementById("edit-notes").value;
        parser.addTask(task);
        notifyChangeListeners();
        hidePopupForEdit();
    });

    editTaskCancel.addEventListener("click", hidePopupForEdit);
}

export function showPopupForDelete(id) {
    const overlay = document.getElementById("overlay");
    const popupDelete = document.getElementById("popup-delete");
    popupDelete.dataset.id = id;
    popupDelete.style.display = "block";
    overlay.style.display = "block";
}

export function showPopupForEdit(id) {
    const task = parser.getTask(id);
    const overlay = document.getElementById("overlay");
    const popupEdit = document.getElementById("edit-popup");
    popupEdit.dataset.id = id;
    popupEdit.style.display = "block";
    overlay.style.display = "block";
    document.getElementById("edit-title").value = task["title"];
    document.getElementById("edit-description").value = task["description"];
    document.getElementById("edit-completed").checked = task["completed"];
    document.getElementById("edit-date").value = task["date"];
    document.getElementById("edit-time").value = task["time"];
    document.getElementById("importance-slider").value = task["importance"] * 100;
    document.getElementById("slider-value").textContent = task["importance"] * 100;
    document.getElementById("edit-color").value = task["color"];
    document.getElementById("edit-notes").value = task["notes"];
}

export function toggleTaskCompletion(id, completed) {
    const task = parser.getTask(id);
    parser.deleteTask(id);
    task.completed = completed;
    parser.addTask(task);
    notifyChangeListeners();
}