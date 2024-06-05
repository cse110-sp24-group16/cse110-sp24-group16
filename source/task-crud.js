// planner.js

// Importing dependencies and utilities
import { getTimeBasedId } from "./util.js";
import { parser } from "./json-parser.js";

// Array to hold change listeners
const changeListeners = [];

/**
 * Add a change listener to the planner.
 * @param {Function} listener - The function to be called when a change occurs.
 */
export function addChangeListener(listener) {
    changeListeners.push(listener);
}

/**
 * Notify all change listeners that a change has occurred.
 */
function notifyChangeListeners() {
    changeListeners.forEach((listener) => listener());
}

// Initialize the planner when the DOM content is loaded
window.addEventListener("DOMContentLoaded", init);

/**
 * Initialize the planner interface and set up event listeners.
 */
function init() {
    // Retrieving DOM elements
    const overlay = document.getElementById("overlay");
    const popupDelete = document.getElementById("popup-delete");
    const popupEdit = document.getElementById("edit-popup");
    const slider = document.getElementById("importance-slider");
    const addTaskButton = document.getElementById("add-button");
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskConfirm = document.getElementById("add-task-confirm");
    const addTaskCancel = document.getElementById("add-task-cancel");
    const deleteTaskConfirm = document.getElementById("confirm-delete");
    const deleteTaskCancel = document.getElementById("cancel-delete");
    const editTaskConfirm = document.getElementById("save-edit");
    const editTaskCancel = document.getElementById("cancel-edit");

    // Event listener for the importance slider
    slider.addEventListener("input", () => {
        document.getElementById("slider-value").textContent = slider.value;
    });

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
        // Get input values and create a new task object
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
            
            // Add the task using the parser and notify listeners
            parser.addTask(task);
            notifyChangeListeners();

            // Hide the add task popup
            addTaskPopup.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // Other event listeners for delete and edit functionality...
}

/**
 * Show the delete task confirmation popup.
 * @param {string} id - The ID of the task to be deleted.
 */
export function showPopupForDelete(id) {
    const overlay = document.getElementById("overlay");
    const popupDelete = document.getElementById("popup-delete");
    popupDelete.dataset.id = id;
    popupDelete.style.display = "block";
    overlay.style.display = "block";
}

/**
 * Show the edit task popup with the details of the task to be edited.
 * @param {string} id - The ID of the task to be edited.
 */
export function showPopupForEdit(id) {
    // Retrieve task details from parser
    const task = parser.getTask(id);
    const overlay = document.getElementById("overlay");
    const popupEdit = document.getElementById("edit-popup");
    popupEdit.dataset.id = id;
    popupEdit.style.display = "block";
    overlay.style.display = "block";

    // Populate edit form with task details
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

/**
 * Toggle the completion status of a task.
 * @param {string} id - The ID of the task to toggle completion for.
 * @param {boolean} completed - The new completion status of the task.
 */
export function toggleTaskCompletion(id, completed) {
    // Retrieve task from parser, update completion status, and notify listeners
    const task = parser.getTask(id);
    parser.deleteTask(id);
    task.completed = completed;
    parser.addTask(task);
    notifyChangeListeners();
}
