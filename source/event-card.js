import { showPopupForDelete, showPopupForEdit } from './task-crud.js';
import { convertTo12Hour } from './util.js';

/**
 * Represents a custom event-card element derived from an HTML <li> element.
 * 
 * @name EventCard
 * @class
 * @extends HTMLElement
 */
class EventCard extends HTMLElement {

    constructor() {
        super();
    }

    /** 
     * Set the properties of chlid elements of event-card
     * @name data
     * @method
     * @param {Object} task task object from parser
     * @memberOf EventCard
     */
    set data(task) {
        if (!task) return;

        this.dataset.id = task['id']||'default-id';
        this.style.backgroundColor = task['color']||"#cccccc";

        const eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        eventTime.textContent = convertTo12Hour(task['time']||'12:00 PM');
        this.appendChild(eventTime);

        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = task['title']||'Untitled Event';
        this.appendChild(eventTitle);

        const eventDescription = document.createElement('div');
        eventDescription.className = 'event-description';
        eventDescription.textContent = task['description']||'Write your event discription';
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
