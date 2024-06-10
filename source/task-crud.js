const { getTimeBasedId } = require("./util.js");
const { parser } = require("./json-parser.js");

const changeListeners = [];

/**
 * Adds a change listener to the list of listeners.
 * 
 * @function addChangeListener
 * @param {Function} listener The listener function to add
 */
function addChangeListener(listener) {
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
        const currentDate = new Date();
        
        document.getElementById("new-task-title").value = "Untitled Task";
        document.getElementById("new-task-description").value = "Please write your task description here.";
        document.getElementById("new-task-date").value = currentDate.toISOString().split('T')[0];
        document.getElementById("new-task-time").value = new Date(currentDate.getTime() + 60 * 60 * 1000).toTimeString().substring(0, 5);
        
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
        const title = document.getElementById("new-task-title").value||"Untitled Task";
        const description = document.getElementById("new-task-description").value||"Please write your task description here.";
        const currentDate = new Date();
        const date = document.getElementById("new-task-date").value|| currentDate.toISOString().split('T')[0];
        const time = document.getElementById("new-task-time").value|| currentDate.toTimeString().substring(0, 5);

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

        task["title"] = document.getElementById("edit-title").value||"Untitled Task";
        task["description"] = document.getElementById("edit-description").value||"Please write your task description here.";
        task["completed"] = document.getElementById("edit-completed").checked;
        task["date"] = document.getElementById("edit-date").value||new Date().toISOString().split('T')[0];
        task["time"] = document.getElementById("edit-time").value||new Date().toTimeString().substring(0, 5);
        task["importance"] = document.getElementById("importance-slider").value / 100 || 50;
        task["color"] = document.getElementById("edit-color").value|| "#cccccc";
        task["notes"] = document.getElementById("edit-notes").value||"No additional notes";
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
function showPopupForDelete(id) {
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
function showPopupForEdit(id) {
    const task = parser.getTask(id);
    const overlay = document.getElementById("overlay");
    const popupEdit = document.getElementById("edit-popup");
    popupEdit.dataset.id = id;
    popupEdit.style.display = "block";
    overlay.style.display = "block";
    document.getElementById("edit-title").value = task["title"]||"Untitiled Task";
    document.getElementById("edit-description").value = task["description"]||"No description provided";
    document.getElementById("edit-completed").checked = task["completed"]||false;
    document.getElementById("edit-date").value = task["date"]||new Date().toISOString().split('T')[0];
    document.getElementById("edit-time").value = task["time"]||new Date().toTimeString().substring(0, 5);
    document.getElementById("importance-slider").value = task["importance"] * 100||50;
    document.getElementById("slider-value").textContent = task["importance"] * 100||50;
    document.getElementById("edit-color").value = task["color"]||"#cccccc";
    document.getElementById("edit-notes").value = task["notes"]||"No additional notes.";
}

/**
 * Toggles the completion status of the specified task.
 * 
 * @function toggleTaskCompletion
 * @param {string} id The ID of the task to toggle
 * @param {boolean} completed The new completion status
 */
function toggleTaskCompletion(id, completed) {
    const task = parser.getTask(id);
    parser.deleteTask(id);
    task.completed = completed;
    parser.addTask(task);
    notifyChangeListeners();
}

module.exports = { addChangeListener, toggleTaskCompletion, showPopupForDelete, showPopupForEdit };
