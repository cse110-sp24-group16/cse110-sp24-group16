import { parser } from "./json-parser.js";
import { showPopupForEdit, addChangeListener, toggleTaskCompletion } from "./task-crud.js";

let options = {
    filterText: "",
    sortOrder: "DUE_DATE",
    completed: false,
    startDate: new Date(),
    endDate: new Date()
}

window.addEventListener("DOMContentLoaded", init);

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

    searchBar.addEventListener("input", (event) => {
        const query = event.target.value;
        searchStatus.hidden = query.length === 0;
        searchStatus.textContent = `Showing results for "${query}"`;
        options.filterText = query.toLowerCase();
        refreshTaskList();
    });

    sortOrder.addEventListener("change", (event) => {
        options.sortOrder = event.target.value;
        refreshTaskList();
    });

    completed.addEventListener("change", (event) => {
        options.completed = event.target.checked;
        refreshTaskList();
    });

    startDate.addEventListener("change", (event) => {
        options.startDate = new Date(event.target.value);
        refreshTaskList();
    });

    endDate.addEventListener("change", (event) => {
        options.endDate = new Date(event.target.value);
        refreshTaskList();
    });

    const optionsButton = document.getElementById("options");
    optionsButton.addEventListener("click", () => {
        const menu = document.getElementsByClassName("taskbar-options")[0];
        menu.hidden = !menu.hidden;
    });

    const switchToWeeklyButton = document.getElementById("switch-to-weekly");
    const switchToMonthlyButton = document.getElementById("switch-to-monthly");

    if (switchToWeeklyButton) {
        switchToWeeklyButton.addEventListener("click", () => {
            window.location.href = escape("weekly-planner.html");
        });
    }

    if (switchToMonthlyButton) {
        switchToMonthlyButton.addEventListener("click", () => {
            window.location.href = escape("monthly-planner.html");
        });
    }
}

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

        taskItem.addEventListener("click", () => {
            showPopupForEdit(task["id"]);
        });
        taskList.appendChild(taskItem);
    }
}
