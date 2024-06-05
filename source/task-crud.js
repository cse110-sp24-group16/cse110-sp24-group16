// Importing necessary functions and modules
import {
    getTimeBasedId
} from "./util.js"; // Importing function for generating time-based IDs
import { parser } from "./json-parser.js"; // Importing task parser

// Array to store change listeners
const changeListeners = [];

// Function to add change listeners
export function addChangeListener(listener) {
    changeListeners.push(listener);
}

// Function to notify change listeners
function notifyChangeListeners() {
    changeListeners.forEach((listener) => listener());
}

// Initializing function when DOM content is loaded
window.addEventListener("DOMContentLoaded", init);

// Initialization function
function init() {
    // Retrieving DOM elements
    const overlay = document.getElementById("overlay");
    const popupDelete = document.getElementById("popup-delete");
    const popupEdit = document.getElementById("edit-popup");
    const slider = document.getElementById("importance-slider");

    // Event listener for updating slider value
    slider.addEventListener("input", () => {
        document.getElementById("slider-value").textContent = slider.value;
    });

    // Retrieving DOM elements related to adding tasks
    const addTaskButton = document.getElementById("add-button");
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskConfirm = document.getElementById("add-task-confirm");
    const addTaskCancel = document.getElementById("add-task-cancel");

    // Retrieving DOM elements related to deleting tasks
    const deleteTaskConfirm = document.getElementById("confirm-delete");
    const deleteTaskCancel = document.getElementById("cancel-delete");

    // Retrieving DOM elements related to editing tasks
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

        // Check if all required fields are filled
        if (title && description && date && time) {
            // Create a new task object
            const task = {
                id: getTimeBasedId(), // Generate a unique ID
                title: title,
                description: description,
                date: date,
                time: time,
                completed: false,
                importance: 0,
                color: '#d8e5e8',
                notes: '',
            };
            
            // Add the task to the parser
            parser.addTask(task);
            // Notify change listeners
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

    // Function to hide delete task popup
    function hidePopupForDelete() {
        popupDelete.style.display = "none";
        overlay.style.display = "none";
    }
    
    // Function to hide edit task popup
    function hidePopupForEdit() {
        popupEdit.style.display = "none";
        overlay.style.display = "none";
    }

    // Event listener for confirming task editing
    editTaskConfirm.addEventListener("click", () => {
        const id = popupEdit.dataset.id;
        parser.deleteTask(id);

        // Create a new task object with updated values
        const task = {};
        task["title"] = document.getElementById("edit-title").value;
        task["description"] = document.getElementById("edit-description").value;
        task["completed"] = document.getElementById("edit-completed").checked;
        task["date"] = document.getElementById("edit-date").value;
        task["time"] = document.getElementById("edit-time").value;
        task["importance"] = document.getElementById("importance-slider").value / 100;
        task["color"] = document.getElementById("edit-color").value;
        task["notes"] = document.getElementById("edit-notes").value;
        // Add the updated task to the parser
        parser.addTask(task);
        // Notify change listeners
        notifyChangeListeners();
        // Hide edit popup
        hidePopupForEdit();
    });

    // Event listener for canceling task editing
    editTaskCancel.addEventListener("click", hidePopupForEdit);
}

// Function to display delete task popup
export function showPopupForDelete(id) {
    const overlay = document.getElementById("overlay");
    const popupDelete = document.getElementById("popup-delete");
    popupDelete.dataset.id = id;
    popupDelete.style.display = "block";
    overlay.style.display = "block";
}

// Function to display edit task popup
export function showPopupForEdit(id) {
    // Retrieve task details
    const task = parser.getTask(id);
    const overlay = document.getElementById("overlay");
    const popupEdit = document.getElementById("edit-popup");
    // Set the ID for the edit popup
    popupEdit.dataset.id = id;
    // Display edit popup
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

// Function to toggle task completion
export function toggleTaskCompletion(id, completed) {
    const task = parser.getTask(id);
    // Remove the task from parser
    parser.deleteTask(id);
    // Update completion status
    task.completed = completed;
    // Add updated task to parser
    parser.addTask(task);
    // Notify change listeners
    notifyChangeListeners();
}
