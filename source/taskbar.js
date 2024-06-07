import { parser } from "./json-parser.js";
import { showPopupForEdit, addChangeListener, toggleTaskCompletion } from "./task-crud.js";

let options = {
    filterText: "",
    sortOrder: "DUE_DATE",
    completed: false,
    startDate: new Date(),
    endDate: new Date()
};

window.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the task manager by setting up event listeners and configuring options.
 * 
 * @name taskbar-init
 * @function init
 */
function init() {
    addChangeListener(refreshTaskList);
    
    const searchBar = document.getElementById("taskbar-option-search-bar");
    const sortOrder = document.getElementById("taskbar-option-sort-order");
    const completed = document.getElementById("taskbar-option-completed");
    const startDate = document.getElementById("taskbar-option-start-date");
    const endDate = document.getElementById("taskbar-option-end-date");

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    startDate.value = start.toISOString().split("T")[0];
    endDate.value = end.toISOString().split("T")[0];

    options = {
        filterText: searchBar.value,
        sortOrder: sortOrder.value,
        completed: completed.checked,
        startDate: start,
        endDate: end,
    };
    refreshTaskList();

    const searchStatus = document.getElementById("taskbar-search-status");
    searchStatus.hidden = true;

    /**
     * Event listener for search bar input to filter tasks.
     * 
     * @name searchBarInputListener
     * @function
     * @param {Event} event - The input event
     */
    searchBar.addEventListener("input", (event) => {
        const query = event.target.value;
        searchStatus.hidden = query.length === 0;
        searchStatus.textContent = `Showing results for "${query}"`;
        options.filterText = query.toLowerCase();
        refreshTaskList();
    });

    /**
     * Event listener for changing the sort order of tasks.
     * 
     * @name sortOrderChangeListener
     * @function
     * @param {Event} event - The change event
     */
    sortOrder.addEventListener("change", (event) => {
        options.sortOrder = event.target.value;
        refreshTaskList();
    });

    /**
     * Event listener for changing the completion status filter.
     * 
     * @name completedChangeListener
     * @function
     * @param {Event} event - The change event
     */
    completed.addEventListener("change", (event) => {
        options.completed = event.target.checked;
        refreshTaskList();
    });

    /**
     * Event listener for changing the start date filter.
     * 
     * @name startDateChangeListener
     * @function
     * @param {Event} event - The change event
     */
    startDate.addEventListener("change", (event) => {
        options.startDate = new Date(event.target.value);
        refreshTaskList();
    });

    /**
     * Event listener for changing the end date filter.
     * 
     * @name endDateChangeListener
     * @function
     * @param {Event} event - The change event
     */
    endDate.addEventListener("change", (event) => {
        options.endDate = new Date(event.target.value);
        refreshTaskList();
    });

    /**
     * Event listener for toggling the visibility of taskbar options.
     * 
     * @name optionsButtonClickListener
     * @function
     */
    const optionsButton = document.getElementById("options");
    optionsButton.addEventListener("click", () => {
        const menu = document.getElementsByClassName("taskbar-options")[0];
        menu.hidden = !menu.hidden;
    });

    const switchToWeeklyButton = document.getElementById("switch-to-weekly");
    const switchToMonthlyButton = document.getElementById("switch-to-monthly");

    /**
     * Event listener for switching to the weekly planner view.
     * 
     * @name switchToWeeklyButtonClickListener
     * @function
     */
    if (switchToWeeklyButton) {
        switchToWeeklyButton.addEventListener("click", () => {
            window.location.href = escape("weekly-planner.html");
        });
    }

    /**
     * Event listener for switching to the monthly planner view.
     * 
     * @name switchToMonthlyButtonClickListener
     * @function
     */
    if (switchToMonthlyButton) {
        switchToMonthlyButton.addEventListener("click", () => {
            window.location.href = escape("monthly-planner.html");
        });
    }
}

/**
 * Refreshes the task list based on the current options.
 * 
 * @function refreshTaskList
 */
export function refreshTaskList() {
    const tasks = parser.getTasks();
    const taskList = document.querySelector("#taskbar-list");
    taskList.innerHTML = "";

    // Sort tasks by importance or due date
    if (options.sortOrder && options.sortOrder === "DUE_DATE") {
        tasks.sort((a, b) => new Date(a["date"]) - new Date(b["date"]));
    } else {
        tasks.sort((a, b) => a.importance - b.importance);
    }

    for (const task of tasks) {
        // Filter by search query
        if (
            !task["title"].toLowerCase().includes(options.filterText) &&
            !task["description"].toLowerCase().includes(options.filterText)
        ) {
            continue;
        }

        // Filter by completion status
        if (task.completed && !options.completed) {
            continue;
        }

        // Filter by date range
        if (
            new Date(task["date"]) < options.startDate ||
            new Date(task["date"]) > options.endDate
        ) {
            continue;
        }

        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        // Store the task id in the element
        taskItem.dataset.id = task["id"];

        const taskDateItem = document.createElement("span");
        taskDateItem.className = "task-date";
        taskDateItem.textContent = `${new Date(task["date"]).toDateString()} ${
            task["time"]
        }`;
        taskItem.appendChild(taskDateItem);

        const taskCompletedCheckbox = document.createElement("input");
        taskCompletedCheckbox.type = "checkbox";
        taskCompletedCheckbox.className = "task-completed";
        taskCompletedCheckbox.checked = task.completed;

        /**
         * Event listener for toggling task completion status.
         * 
         * @name taskCompletedCheckboxChangeListener
         * @function
         * @param {Event} event - The change event
         */
        taskCompletedCheckbox.addEventListener("change", (event) => {
            toggleTaskCompletion(task["id"], event.target.checked);
        });
        taskCompletedCheckbox.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        taskItem.appendChild(taskCompletedCheckbox);
        
        const taskTitleItem = document.createElement("span");
        taskTitleItem.className = "task-title";

        taskTitleItem.textContent = `${task["title"]}`;
        taskItem.appendChild(taskTitleItem);

        const hrItem = document.createElement("hr");
        hrItem.style.backgroundColor = task["color"];
        taskItem.appendChild(hrItem);

        const taskDescriptionItem = document.createElement("p");
        taskDescriptionItem.className = "task-description";
        taskDescriptionItem.textContent = task["description"];
        taskItem.appendChild(taskDescriptionItem);

        /**
         * Event listener for opening the edit task popup.
         * 
         * @name taskItemClickListener
         * @function
         */
        taskItem.addEventListener("click", () => {
            showPopupForEdit(task["id"]);
        });
        taskList.appendChild(taskItem);
    }
}
