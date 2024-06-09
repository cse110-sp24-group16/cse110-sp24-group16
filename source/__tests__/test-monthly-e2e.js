const { browser } = require("@wdio/globals");
const path = require("path");

let MONTHLY_URL;

describe("Testing of the To Do List element", () => {
    // First, visit the monthly view page
    beforeEach(async () => {
      if (!MONTHLY_URL) {
        // Set up URLs
        MONTHLY_URL = await browser.getUrl();
      }
      await browser.url(MONTHLY_URL);
      await browser.pause(800);
    });

    it("add a new task with a specific time", async () => {
      const addTaskButton = await browser.$("#add-button");
      await addTaskButton.click();
  
      const taskTitleInput = await browser.$("#new-task-title");
      await taskTitleInput.setValue("Do CSE130 homework");
  
      const taskDescInput = await browser.$("#new-task-description");
      await taskDescInput.setValue("Something about haskle");
  
      const taskDateInput = await browser.$("#new-task-date");
      await taskDateInput.setValue("2024-06-10");
  
      const taskTimeInput = await browser.$("#new-task-time");
      await taskTimeInput.setValue("14:00");
  
      const addTaskConfirm = await browser.$("#add-task-confirm");
      await addTaskConfirm.click();
  
      await browser.pause(500); // Wait for the UI to update
      const taskList = await browser.$("#taskbar-list");
      expect(await taskList.getText()).toContain("Do CSE130 homework");
    });

    it("should edit an existing task", async () => {
      const taskItem = await browser.$(".task-item"); // Assume task is visible
      await taskItem.click(); // Open edit popup
  
      const editTitleInput = await browser.$("#edit-title");
      await editTitleInput.setValue("Edited Task Title");
  
      const saveButton = await browser.$("#save-edit");
      await saveButton.click();
  
      await browser.pause(500); // Wait for the UI to update
      expect(await taskItem.getText()).toContain("Edited Task Title");
    });
  
    it("should delete a task", async () => {
      const taskItem = await browser.$(".task-item"); // Assume task is visible
      const deleteButton = await taskItem.$(".delete-button");
      await deleteButton.click();
  
      const confirmDeleteButton = await browser.$("#confirm-delete");
      await confirmDeleteButton.click();
  
      await browser.pause(500); // Ensure the task is deleted
      expect(await browser.$(".task-item")).not.toBeExisting();
    });
  
});