const tasks = [
    {
        "task-date": new Date("2024.06.24"),
        "task-time": "03:00 PM",
        "task-title": "Team Meeting",
        "task-description":
            "Our weekly team meeting to discuss progress and goals.",
        importance: 0.5,
        color: "#7db6a3",
        notes: "Don't forget to bring the project plan.",
        completed: true,
    },
    {
        "task-date": new Date("2024.06.26"),
        "task-time": "11:59 PM",
        "task-title": "Checkpoint Video Due",
        "task-description":
            "Submit our checkpoint video by the end of the day.",
        importance: 0.3,
        color: "#e69996",
        notes: "Make sure to include all team members in the video.",
        completed: true,
    },
];

window.addEventListener("DOMContentLoaded", init);

function init() {
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

    const options = {
        filterText: searchBar.value,
        sortOrder: sortOrder.value,
        completed: completed.checked,
        startDate: start,
        endDate: end,
    };
    refreshTaskList(options);

    const searchStatus = document.getElementById("taskbar-search-status");
    searchStatus.hidden = true;

    searchBar.addEventListener("input", (event) => {
        const query = event.target.value;
        searchStatus.hidden = query.length === 0;
        searchStatus.textContent = `Showing results for "${query}"`;
        options.filterText = query.toLowerCase();
        refreshTaskList(options);
    });

    sortOrder.addEventListener("change", (event) => {
        options.sortOrder = event.target.value;
        refreshTaskList(options);
    });

    completed.addEventListener("change", (event) => {
        options.completed = event.target.checked;
        refreshTaskList(options);
    });

    startDate.addEventListener("change", (event) => {
        options.startDate = new Date(event.target.value);
        refreshTaskList(options);
    });

    endDate.addEventListener("change", (event) => {
        options.endDate = new Date(event.target.value);
        refreshTaskList(options);
    });

    const optionsButton = document.getElementById("options");
    optionsButton.addEventListener("click", () => {
        const menu = document.getElementsByClassName("taskbar-options")[0];
        menu.hidden = !menu.hidden;
    });

    const switchToWeeklyButton = document.getElementById("switch-to-weekly");

    if (switchToWeeklyButton) {
        switchToWeeklyButton.addEventListener("click", () => {
            window.location.href = escape("planner.html");
        });
    }
}

function refreshTaskList(options) {
    const taskList = document.querySelector("#taskbar-list");
    taskList.innerHTML = "";

    // Sort tasks by importance or due date
    if (options.sortOrder && options.sortOrder === "DUE_DATE") {
        tasks.sort((a, b) => a["task-date"] - b["task-date"]);
    } else {
        tasks.sort((a, b) => a.importance - b.importance);
    }

    for (const task of tasks) {
        // Filter by search query
        if (
            !task["task-title"].toLowerCase().includes(options.filterText) &&
            !task["task-description"].toLowerCase().includes(options.filterText)
        ) {
            continue;
        }

        // Filter by completion status
        if (task.completed && !options.completed) {
            continue;
        }

        // Filter by date range
        if (
            task["task-date"] < options.startDate ||
            task["task-date"] > options.endDate
        ) {
            continue;
        }

        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
          <span class="task-date">${task["task-date"].toDateString()} ${
            task["task-time"]
        }</span>
          <span class="task-title"><input type="checkbox" class="task-completed" ${
              task.completed ? "checked" : ""
          }/> ${task["task-title"]}</span>
          <hr style="background-color: ${task["color"]};"/>
          <p class="task-description">${task["task-description"]}</p>
      `;
        taskList.appendChild(taskItem);
    }
}

export { tasks };
