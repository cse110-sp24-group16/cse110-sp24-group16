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
      // await taskDateInput.setValue("2024-06-10");
      // await taskTimeInput.setValue("14:00");
      const dateInput = await browser.$("#new-task-date");
      await dateInput.setValue("2024");
      await browser.keys(["ArrowRight", '0', '6', "ArrowRight", '0', '9']);
      // const timeInput = await browser.$("#new-task-time");
      // await timeInput.setValue("");
      // await browser.keys(['0', '9', "ArrowRight", '0', '0',"ArrowRight","ArrowDown"]);
      await browser.pause(200);
      await addTaskConfirm.click();
      await browser.pause(200);
      
      
      //check number of items in the list
      //HELP!!!: issue with get access to the task list, cannot find the selector
      const tasks=await browser.$$("#task-item");
      expect(tasks.length).toBe(11);
      //check the correct information
      const actualTask = await tasks[10];
      const actualTaskTitle=actualTask["title"];
      expect(actualTaskTitle).toBe(`Complete CSE130 HW`);
      
    });


    it("check clicking on add button", async () => {
      await $("#add-button").click();
      await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $("#add-task-cancel").click();
      await browser.pause(500);
      await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });

    it("check clicking on edit button", async () => {
      await $(".task").click();
      await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $(".popup-button-cancel").click();
      await browser.pause(500);
      await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });


    it("check clicking on delete button", async () => {
      await $("#delete-button").click();
      await expect($("#delete-popup")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $(".popup-button-cancel").click();
      await browser.pause(500);
      await expect($("#delete-popup")).toHaveAttribute("style", expect.stringContaining("display: none;"));
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
      const monthlyButton = await $('#switch-to-monthly');

      expect(monthlyButton).not.toBeNull(); 
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

