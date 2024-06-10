const { browser } = require('@wdio/globals');
const path = require("path");

describe("Testing of the task element", () => {
    //Check functionality of clicking on add button, check if popup works
    it("check clicking on add button", async () => {
      const monthlyButton = await browser.$('#switch-to-monthly'); 
      await monthlyButton.click();
      await $("#add-button").click();
      await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $("#add-task-cancel").click();
      await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });

    //Clicks on task in calendar, brings up popup for edit
    it("check clicking on edit button", async () => {
      await $(".task").click({x:-15});
      await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $("#cancel-edit").click();
      await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });
    
    // Check the functionality of the cancel button of a specific task
    it("check clicking on delete button", async () => {
      const task = await $(".task");
      await task.moveTo();
      const button = await $(".delete-button");
      await button.click();
      await expect($("#popup-delete")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $("#cancel-delete").click();
      await expect($("#popup-delete")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });
    
    //Check Clicking on next month button, goes to next month
    it('check navigation to the previous month', async () => {
      const prevButton = await $('#prev-button');
      await prevButton.click();
      const monthTitle = await $('#month-title').getText();
      expect(monthTitle).toBe('May 2024'); 
    });

    //Check Clicking on today button, goes to today's month
    it('should navigate to current', async () => {
      const nextButton = await $('#cur-button');
      await nextButton.click();
      const monthTitle = await $('#month-title').getText();
      expect(monthTitle).toBe('June 2024'); 
    });

    //Check clicking on previous month button, goes to last month
    it('should navigate to the next month', async () => {
        const nextButton = await $('#next-button');
        await nextButton.click();
        const monthTitle = await $('#month-title').getText();
        expect(monthTitle).toBe('July 2024'); 
    });

    it('test on change to weekly view', async () => {
      const weeklyButton = await $('#switch-to-weekly');
      await weeklyButton.click();
      const monthlyButton = await $('#switch-to-monthly');

      expect(monthlyButton).not.toBeNull(); 
      //back to monthly
      await monthlyButton.click();
    });
  
    //when clicking on journal icon, bring up journal popup.
    //Should convert markdown text into html and display on screen
    it("test on entry into journal with markdown", async () => {
      const journalButton = await browser.$(".journal-button"); 
      await journalButton.click();
      const markdownInput = await browser.$("#markdownInput");
      await markdownInput.setValue("**Hey** and _how are you_");
      const markdownPreview = await browser.$("#markdownPreview");
      const htmlContent = await markdownPreview.getHTML();
      expect(htmlContent).toContain('<strong>Hey</strong>');
      expect(htmlContent).toContain('<em>how are you</em>');

      const saveButton = await browser.$("#closePopup-journal");
      await saveButton.click();
    });

});

