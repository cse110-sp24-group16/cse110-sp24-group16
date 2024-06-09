const { browser, expect, $ } = require("@wdio/globals");
const { time } = require("console");

describe("Electron Testing", () => {
  it("should print application title", async () => {
    await expect($("h1")).toHaveText("Task List");
  });

  it("should display the current week", async () => {
    await expect($("#month-title")).toHaveText("June 2024");
    await expect($(".calendar .day > header")).toHaveText("Sunday 9");
    await browser.pause(2000);
  });

  it("check clicking on add button", async () => {
    await $("#add-button").click();
    await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: block;"));
    await $("#add-task-cancel").click();
    await browser.pause(500);
    await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: none;"));
  });

   it("check adding a new task with time", async() => {
    (await $("#add-button")).click();
    (await $("#new-task-title")).setValue("New Meeting");
    (await $("#new-task-description")).setValue("New meeting with colleagues");
    const dateInput = await browser.$("#new-task-date");    
    await dateInput.setValue("2024");
    await browser.keys(["ArrowRight", '0', '6', "ArrowRight", '0', '9']);
    const timeInput = await browser.$("#new-task-time");
    await timeInput.setValue("");
    await browser.keys(["ArrowDown", "ArrowRight", '0', '9', "ArrowRight", '0', '0']);
    await browser.pause(1000);
    (await $("#add-task-confirm")).click();
    await browser.pause(5000);
   })
});
