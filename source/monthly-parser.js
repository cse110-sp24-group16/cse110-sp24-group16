//fetch and process JSON data
async function loadTasks() {
    try {
        const response = await fetch('task.json'); // Fetching the JSON file from the same directory
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error fetching or parsing tasks:', error);
    }
}

//display tasks in the backlog and on the calendar
function displayTasks(tasks) {
    const backlog = document.querySelector('.taskbar-wrapper');
    const calendar = document.querySelector('#calendar');
    
    //placeholder to replace with actual user's name
    const userName = 'User';
    backlog.querySelector('h2').textContent = `Hello, ${userName}!`;

    //initialize task count
    let taskCount = 0;

    tasks.forEach(task => {
        //create task element for the backlog
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `<strong>${task.title}</strong><br>${task.description}`;

        //add task to backlog
        backlog.appendChild(taskElement);

        //find the respective day element in the calendar
        const taskDate = new Date(task.date);
        const dayNumber = taskDate.getDate();
        const dayElement = Array.from(calendar.children).find(
            day => day.classList.contains('day') && 
                   day.querySelector('.day-number').textContent == dayNumber
        );

        if (dayElement) {
            //add task to the specific day
            const taskList = dayElement.querySelector('.task-list') || document.createElement('ul');
            taskList.classList.add('task-list');
            const taskItem = document.createElement('li');
            taskItem.classList.add('task');
            taskItem.textContent = task.title;
            taskList.appendChild(taskItem);
            if (!dayElement.contains(taskList)) {
                dayElement.appendChild(taskList);
            }
        }

        //increment task count
        taskCount++;
    });

    //update task count in the backlog header
    backlog.querySelector('h3').textContent = `You have ${taskCount} tasks due for May 2024.`;
}

//load tasks when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadTasks);
