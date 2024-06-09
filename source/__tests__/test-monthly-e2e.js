const { browser } = require('@wdio/globals');
const path = require("path");

let MONTHLY_URL;

describe("Testing of the task element", () => {
    //HELP!!!: I am not sure about if this is the write way to navigate to the montly-view
    beforeEach(async () => {
      if (!MONTHLY_URL) {
        // Set up URLs
        MONTHLY_URL = await browser.getUrl();
      }
      await browser.url(MONTHLY_URL);
      const monthlyButton = await browser.$('#switch-to-monthly'); 
      await monthlyButton.click();
      await browser.pause(800);
    });

    //test on add new task in montly-view
    it("test on add a new task with a specific time", async () => {
      const addTaskButton = await browser.$("#add-button");
      const taskTitleInput = await browser.$("#new-task-title");
      const taskDescInput = await browser.$("#new-task-description");
      const taskDateInput = await browser.$("#new-task-date");
      const taskTimeInput = await browser.$("#new-task-time");
      const addTaskConfirm = await browser.$("#add-task-confirm");
      
      //perform add function
      await addTaskButton.click();
      await browser.pause(100);
      await taskTitleInput.setValue("Do CSE130 homework");
      await taskDescInput.setValue("Something about haskle");
      await taskDateInput.setValue("2024-06-10");
      await taskTimeInput.setValue("14:00");
      await browser.pause(100);
      await addTaskConfirm.click();
      
      
      //check number of items in the list
      //HELP!!!: issue with get access to the task list, cannot find the selector
      const tasks=await browser.$("#taskbar-list");
      expect(tasks.length).toBe(11);
      //check the correct information
      const actualTask = await tasks[10];
      const actualTaskTitle=actualTask["title"];
      expect(actualTaskTitle).toBe(`Complete CSE130 HW`);
      
    });



    it('should edit the task title', async () => {
      //HELP!!!: how to get access to the specific event task
      const eventCard = await $('.event-card');
      const editButton = await $('.edit-button'); 
      await editButton.click();

      const titleField = await $('#edit-title');
      await titleField.setValue('CSE 110 hw');

      const saveButton = await $('#save-edit');
      await saveButton.click();

      const updatedTitle = await $('#task-title-display').getText(); // assuming this is the display element
      expect(updatedTitle).toEqual('CSE 110 hw');
  });
  

    it('should delete the event card', async () => {
      //HELP!!!: how to get access to the specific event task
      const eventCard = await $('.event-card'); 
      const deleteButton = await eventCard.$('.delete-button');
      await deleteButton.click();

      const confirmDeleteButton = await $('#confirm-delete');
      await confirmDeleteButton.click();

      const eventCardExists = await eventCard.isExisting();
      expect(eventCardExists).toEqual(false);
    });

    
    
    it('check navigation to the previous month', async () => {
      const prevButton = await $('#prev-button');
      await prevButton.click();
      const monthTitle = await $('#month-title').getText();
      expect(monthTitle).toBe('May 2024'); 
    });

    
    it('should navigate to the next month', async () => {
        const nextButton = await $('#next-button');
        await nextButton.click();
        const monthTitle = await $('#month-title').getText();
        expect(monthTitle).toBe('July 2024'); 
    });

    // it('should go back to current month', async () => {
    //   const todayButton = await $('#cur-button');
    //   await todayButton.click();
    //   const monthTitle = await $('#month-title').getText();
    //   expect(monthTitle).to.include('Jun 2024'); 
    // });



    //HELP!!!: need help on how to get access to weekly browser and check
    it('test on change to weekly view', async () => {
      const weeklyButton = await $('#switch-to-weekly');
      await weeklyButton.click();
      const currentView = await browser.getUrl(); 
      expect(currentView).to.include('weekly'); 
    });

    it('test on change to monthly view', async () => {
        const monthlyButton = await $('#switch-to-monthly'); 
        await monthlyButton.click();
        const currentView = await browser.getUrl(); 
        expect(currentView).to.include('monthly');
    });
  

    it("test on entry into journal with markdown", async () => {
      //HELP!!!: I cannot find where is the button to click on jounrl
      const journalButton = await browser.$("#journal-entry-button"); 
      await journalButton.click();

      const markdownInput = await browser.$("#markdownInput");
      await markdownInput.setValue("**Hey** and _how are you_");
      const htmlContent = await mainClient.getHTML('#markdownPreview');
      expect(htmlContent).to.include('<strong>Hey</strong>');
      expect(htmlContent).to.include('<em>how are you</em>');

      const saveButton = await browser.$("#closePopup-journal");
      await saveButton.click();

      
    });


});

