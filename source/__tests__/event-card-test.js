const { browser, expect, $ } = require("@wdio/globals");

// Describe test suite
describe("EventCard Custom Element", () => {
  // Before each test, perform the setup
  beforeEach(async () => {
    // Navigate to a blank page
    await browser.url("about:blank");

    // Execute custom script to define the EventCard element and its behavior
    await browser.execute(() => {
      // Define dummy functions to simulate popup behavior
      window.showPopupForEdit = (id) => { window.lastEditId = id; };
      window.showPopupForDelete = (id) => { window.lastDeleteId = id; };
      window.convertTo12Hour = (time) => time;

      // Define the custom element EventCard
      class EventCard extends HTMLElement {
        constructor() {
          super();
        }

        // Setter for the data property
        set data(task) {
          if (!task) return;

          // Set the dataset id and background color
          this.dataset.id = task['id'] || 'default-id';
          this.style.backgroundColor = task['color'] || "#cccccc";

          // Create and append event time element
          const eventTime = document.createElement('div');
          eventTime.className = 'event-time';
          eventTime.textContent = convertTo12Hour(task['time'] || '12:00 PM');
          this.appendChild(eventTime);

          // Create and append event title element
          const eventTitle = document.createElement('div');
          eventTitle.className = 'event-title';
          eventTitle.textContent = task['title'] || 'Untitled Event';
          this.appendChild(eventTitle);

          // Create and append event description element
          const eventDescription = document.createElement('div');
          eventDescription.className = 'event-description';
          eventDescription.textContent = task['description'] || 'Write your event description';
          this.appendChild(eventDescription);

          // Create container for buttons
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'button-container';

          // Create and append edit button with click event listener
          const editButton = document.createElement('button');
          editButton.className = 'edit-button';
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => showPopupForEdit(task['id']));
          buttonContainer.appendChild(editButton);

          // Create and append delete button with click event listener
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button';
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => showPopupForDelete(task['id']));
          buttonContainer.appendChild(deleteButton);

          // Append button container to the element
          this.appendChild(buttonContainer);
        }
      }

      // Define the custom element
      customElements.define('event-card', EventCard);

      // Create an instance of the custom element and append it to the body
      const eventCard = document.createElement('event-card');
      document.body.appendChild(eventCard);
    });
  });

  // Test to verify data setting and child elements creation
  it("should set data and create child elements", async () => {
    // Define a sample task object
    const task = {
      id: 'task-1',
      color: 'blue',
      time: '10:00 AM',
      title: 'Test Event',
      description: 'This is a test event description'
    };

    // Set the task data to the event-card element
    await browser.execute(task => {
      document.querySelector('event-card').data = task;
    }, task);

    // Select the event-card element and verify its presence
    const eventCard = await $('event-card');
    await expect(eventCard).toBePresent();

    // Verify the text content of the event time element
    const eventTime = await $('.event-time');
    await expect(eventTime).toHaveText('10:00 AM');

    // Verify the text content of the event title element
    const eventTitle = await $('.event-title');
    await expect(eventTitle).toHaveText('Test Event');

    // Verify the text content of the event description element
    const eventDescription = await $('.event-description');
    await expect(eventDescription).toHaveText('This is a test event description');

    // Verify the presence of the edit button
    const editButton = await $('.edit-button');
    await expect(editButton).toBePresent();

    // Verify the presence of the delete button
    const deleteButton = await $('.delete-button');
    await expect(deleteButton).toBePresent();
  });

  // Test to verify the edit button click behavior
  it("should call showPopupForEdit when edit button is clicked", async () => {
    // Define a sample task object
    const task = { id: 'task-1', title: 'Test Event' };

    // Set the task data to the event-card element
    await browser.execute(task => {
      document.querySelector('event-card').data = task;
    }, task);

    // Select the edit button and click it
    const editButton = await $('.edit-button');
    await editButton.click();

    // Verify the last edit id
    const lastEditId = await browser.execute(() => window.lastEditId);
    expect(lastEditId).toBe('task-1');
  });

  // Test to verify the delete button click behavior
  it("should call showPopupForDelete when delete button is clicked", async () => {
    // Define a sample task object
    const task = { id: 'task-1', title: 'Test Event' };

    // Set the task data to the event-card element
    await browser.execute(task => {
      document.querySelector('event-card').data = task;
    }, task);

    // Select the delete button and click it
    const deleteButton = await $('.delete-button');
    await deleteButton.click();

    // Verify the last delete id
    const lastDeleteId = await browser.execute(() => window.lastDeleteId);
    expect(lastDeleteId).toBe('task-1');
  });
});
