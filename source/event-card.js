import { showPopupForDelete, showPopupForEdit } from './task-crud.js';
import { convertTo12Hour } from './util.js';

//create custom event-card element from <li>
class EventCard extends HTMLElement {

    constructor() {
        super();
    }

    /** Set the properties of chlid elements of event-card
     * @param {Object} task
     */
    set data(task) {
        if (!task) return;

        this.dataset.id = task['id'];
        this.style.backgroundColor = task['color'];

        const eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        eventTime.textContent = convertTo12Hour(task['time']);
        this.appendChild(eventTime);

        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = task['title'];
        this.appendChild(eventTitle);

        const eventDescription = document.createElement('div');
        eventDescription.className = 'event-description';
        eventDescription.textContent = task['description'];
        this.appendChild(eventDescription);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => showPopupForEdit(task['id']));
        buttonContainer.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => showPopupForDelete(task['id']));
        buttonContainer.appendChild(deleteButton);

        this.appendChild(buttonContainer);
    }
}

customElements.define('event-card', EventCard);