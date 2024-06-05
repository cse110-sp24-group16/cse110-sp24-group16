import {
    getTimeBasedId
} from "./util.js";
import { parser } from "./json-parser.js";

const changeListeners = [];

/**
 * Adds a change listener to the list of listeners.
 * 
 * @function addChangeListener
 * @param {Function} listener The listener function to add
 */
export function addChangeListener(listener) {
    changeListeners.push(listener);
}

/**
 * Notifies all registered change listeners.
 * 
 * @function notifyChangeListeners
 */
function notifyChangeListeners() {
    changeListeners.forEach((listener) => listener());
}

window.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the task planner by setting up event listeners and popups.
 * 
 * @name crud-init
 * @function init
 */
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

    /**
     * Event listener for opening the add new task popup.
     * 
     * @name addTaskButtonClickListener
     * @function
     */
    addTaskButton.addEventListener("click", () => {
        addTaskPopup.style.display = "block";
        overlay.style.display = "block";
    });

    /**
     * Event listener for closing the add new task popup.
     * 
     * @name addTaskCancelClickListener
     * @function
     */
    addTaskCancel.addEventListener("click", () => {
        addTaskPopup.style.display = "none";
        overlay.style.display = "none";
    });

    /**
     * Event listener for adding a new task.
     * 
     * @name addTaskConfirmClickListener
     * @function
     */
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

    /**
     * Event listener for confirming the task deletion.
     * 
     * @name deleteTaskConfirmClickListener
     * @function
     */
    deleteTaskConfirm.addEventListener("click", () => {
        const id = popupDelete.dataset.id;
        parser.deleteTask(id);
        notifyChangeListeners();

        // Disable pop-up after deleting task
        hidePopupForDelete();
    });

    /**
     * Event listener for canceling the task deletion.
     * 
     * @name deleteTaskCancelClickListener
     * @function
     */
    deleteTaskCancel.addEventListener("click", hidePopupForDelete);

    /**
     * Hides the delete task popup.
     * 
     * @function hidePopupForDelete
     */
    function hidePopupForDelete() {
        popupDelete.style.display = "none";
        overlay.style.display = "none";
    }
    
    /**
     * Hides the edit task popup.
     * 
     * @function hidePopupForEdit
     */
    function hidePopupForEdit() {
        popupEdit.style.display = "none";
        overlay.style.display = "none";
    }

    /**
     * Event listener for confirming the task edit.
     * 
     * @name editTaskConfirmClickListener
     * @function
     */
    editTaskConfirm.addEventListener("click", () => {
        const id = popupEdit.dataset.id;
        const task = parser.getTask(id);
        parser.deleteTask(id);

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

    /**
     * Event listener for canceling the task edit.
     * 
     * @name editTaskCancelClickListener
     * @function
     */
    editTaskCancel.addEventListener("click", hidePopupForEdit);
}

/**
 * Shows the delete task popup for the specified task ID.
 * 
 * @function showPopupForDelete
 * @param {string} id The ID of the task to delete
 */
export function showPopupForDelete(id) {
    const overlay = document.getElementById("overlay");
    const popupDelete = document.getElementById("popup-delete");
    popupDelete.dataset.id = id;
    popupDelete.style.display = "block";
    overlay.style.display = "block";
}

/**
 * Shows the edit task popup for the specified task ID.
 * 
 * @function showPopupForEdit
 * @param {string} id The ID of the task to edit
 */
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

/**
 * Toggles the completion status of the specified task.
 * 
 * @function toggleTaskCompletion
 * @param {string} id The ID of the task to toggle
 * @param {boolean} completed The new completion status
 */
export function toggleTaskCompletion(id, completed) {
    const task = parser.getTask(id);
    parser.deleteTask(id);
    task.completed = completed;
    parser.addTask(task);
    notifyChangeListeners();
}
