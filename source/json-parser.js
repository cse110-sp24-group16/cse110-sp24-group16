// json-parser.js
const FILE_NAME = "source/task.json";

const fs = require("fs");

// Create a wrapper object to hold all of the parser functions for easy exporting.
export const parser = {};

/**
 * Returns a dictionary with all tasks from a file in the format of id: task.
 *
 * @name getTasks
 * @function
 * @returns {Object} A dictionary of all tasks
 */
parser.getTasks = () => {
    const tasks = JSON.parse(fs.readFileSync(FILE_NAME, "utf8")) || {};
    tasks.sort((a, b) => new Date(a["date"] + ' ' + a['time']) - new Date(b["date"] + ' ' + b['time']));
    return tasks;
};

/**
 * Returns a task with the given id.
 * If the task is not found, return null.
 * 
 * @name getTask
 * @function
 * @param {String} id The id of the task to get
 * @returns {Object|null} The task with the given id
 */
parser.getTask = function (id) {
    const tasks = parser.getTasks();

    for (const task of tasks) {
        if (task.id === id) {
            return task;
        }
    }
    return null;
};

/**
 * Saves the tasks to file.
 *
 * @param {Object} array of tasks to save to file
 * @returns {void}
 */
function saveTasks(tasks) {
    try {
        fs.writeFileSync(FILE_NAME, JSON.stringify(tasks));
    } catch (err) {
        console.log("Could not save to file", err);
    }
}

/**
 * Adds a task to file.
 *
 * @name addTask
 * @function
 * @param {Object} task The task to add
 * @returns {void}
 */
parser.addTask = function (task) {
    const tasks = parser.getTasks();
    tasks.push(task);
    saveTasks(tasks);
};

/**
 * Deletes a task from file.
 *
 * @name deleteTask
 * @function
 * @param {String} id The id of the task to delete
 * @returns {void}
 */
parser.deleteTask = function (id) {
    let tasks = parser.getTasks();
    tasks = tasks.filter((task) => task.id != id);
    saveTasks(tasks);
};
