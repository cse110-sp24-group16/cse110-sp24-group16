const { browser, expect, $ } = require("@wdio/globals");

describe("EventCard Custom Element", () => {
  beforeEach(async () => {
    await browser.url("about:blank");

    await browser.execute(() => {
      window.showPopupForEdit = (id) => { window.lastEditId = id; };
      window.showPopupForDelete = (id) => { window.lastDeleteId = id; };
      window.convertTo12Hour = (time) => time;

      class EventCard extends HTMLElement {
        constructor() {
          super();
        }

        set data(task) {
          if (!task) return;

          this.dataset.id = task['id'] || 'default-id';
          this.style.backgroundColor = task['color'] || "#cccccc";

          const eventTime = document.createElement('div');
          eventTime.className = 'event-time';
          eventTime.textContent = convertTo12Hour(task['time'] || '12:00 PM');
          this.appendChild(eventTime);

          const eventTitle = document.createElement('div');
          eventTitle.className = 'event-title';
          eventTitle.textContent = task['title'] || 'Untitled Event';
          this.appendChild(eventTitle);

          const eventDescription = document.createElement('div');
          eventDescription.className = 'event-description';
          eventDescription.textContent = task['description'] || 'Write your event description';
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

      const eventCard = document.createElement('event-card');
      document.body.appendChild(eventCard);
    });
  });

  it("should set data and create child elements", async () => {
    const task = {
      id: 'task-1',
      color: 'blue',
      time: '10:00 AM',
      title: 'Test Event',
      description: 'This is a test event description'
    };

    await browser.execute(task => {
      document.querySelector('event-card').data = task;
    }, task);

    const eventCard = await $('event-card');
    await expect(eventCard).toBePresent();

    const eventTime = await $('.event-time');
    await expect(eventTime).toHaveText('10:00 AM');

    const eventTitle = await $('.event-title');
    await expect(eventTitle).toHaveText('Test Event');

    const eventDescription = await $('.event-description');
    await expect(eventDescription).toHaveText('This is a test event description');

    const editButton = await $('.edit-button');
    await expect(editButton).toBePresent();

    const deleteButton = await $('.delete-button');
    await expect(deleteButton).toBePresent();
  });

  it("should call showPopupForEdit when edit button is clicked", async () => {
    const task = { id: 'task-1', title: 'Test Event' };
    await browser.execute(task => {
      document.querySelector('event-card').data = task;
    }, task);

    const editButton = await $('.edit-button');
    await editButton.click();

    const lastEditId = await browser.execute(() => window.lastEditId);
    expect(lastEditId).toBe('task-1');
  });

  it("should call showPopupForDelete when delete button is clicked", async () => {
    const task = { id: 'task-1', title: 'Test Event' };
    await browser.execute(task => {
      document.querySelector('event-card').data = task;
    }, task);

    const deleteButton = await $('.delete-button');
    await deleteButton.click();

    const lastDeleteId = await browser.execute(() => window.lastDeleteId);
    expect(lastDeleteId).toBe('task-1');
  });
});
