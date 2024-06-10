const { browser } = require('@wdio/globals');
const path = require("path");

let MONTHLY_URL;

describe("Testing of the task element", () => {

    it("check clicking on add button", async () => {
      const monthlyButton = await browser.$('#switch-to-monthly'); 
      await monthlyButton.click();
      await $("#add-button").click();
      await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $("#add-task-cancel").click();
      await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });

    
    it("check clicking on edit button", async () => {
      await $(".task").click();
      await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await browser.pause(15000);
      await $("#cancel-edit").click();
      await browser.pause(15000);
      await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });

    // Check the functionality of the cancel button of a specific task
    it("check clicking on delete button", async () => {
      const task = await $("event-card");
      await task.moveTo();
      await $(".delete-button").click();
      await expect($("#popup-delete")).toHaveAttribute("style", expect.stringContaining("display: block;"));
      await $("#cancel-delete").click();
      await expect($("#popup-delete")).toHaveAttribute("style", expect.stringContaining("display: none;"));
    });
    
    it('check navigation to the previous month', async () => {
      const prevButton = await $('#prev-button');
      await prevButton.click();
      const monthTitle = await $('#month-title').getText();
      expect(monthTitle).toBe('May 2024'); 
    });

    it('should navigate to current', async () => {
      const nextButton = await $('#cur-button');
      await nextButton.click();
      const monthTitle = await $('#month-title').getText();
      expect(monthTitle).toBe('June 2024'); 
    });

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
  

    it("test on entry into journal with markdown", async () => {
      const journalButton = await browser.$(".journal-button"); 
      await journalButton.click();
      const markdownInput = await browser.$("#markdownInput");
      await markdownInput.setValue("**Hey** and _how are you_");
      const markdownPreview = await browser.$("#markdownPreview")
      const htmlContent = await markdownPreview.getHTML();
      expect(htmlContent).toContain('<strong>Hey</strong>');
      expect(htmlContent).toContain('<em>how are you</em>');

      const saveButton = await browser.$("#closePopup-journal");
      await saveButton.click();
    });


});

