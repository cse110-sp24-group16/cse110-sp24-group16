const { browser, expect, $ } = require("@wdio/globals");
const { time } = require("console");

const currDate = new Date().getDate();

describe("Electron Testing", () => {
  it("should print application title", async () => {
    await expect($("h1")).toHaveText("Task List");
  });

  // Check if current date is displayed when window is opened
  it("should display the current week", async () => {
    await expect($("#month-title")).toHaveText("June 2024");
    const todayDate = (await (await $(".calendar .day > header")).getText()).slice(-1);
    await expect(todayDate).toBe(currDate.toString());
  });

  // Check the functionality of the add task button
  it("check clicking on add button", async () => {
    await $("#add-button").click();
    await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: block;"));
    await $("#add-task-cancel").click();
    await expect($("#overlay")).toHaveAttribute("style", expect.stringContaining("display: none;"));
  });

  // Check the functionality of the edit button of a specific task
  it("check clicking on edit button", async () => {
    const task = await $("event-card");
    await task.moveTo();
    await $(".edit-button").click();
    await expect($("#edit-popup")).toHaveAttribute("style", expect.stringContaining("display: block;"));
    await $("#cancel-edit").click();
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

  // Check switching into next week
  it("check going into the next week", async () => {
    const todayDate = (await (await $(".day > header")).getText()).slice(-2);
    (await $("#next-button")).click();
    const nextweekDate = (await (await $(".day > header")).getText()).slice(-2);
    await expect(nextweekDate - todayDate).toBe(7);
  });

  // Check switching to the previous week
  it("check going into the next week", async () => {
    const todayDate = (await (await $(".day > header")).getText()).slice(-2);
    (await $("#prev-button")).click();
    const lastweekDate = (await (await $(".day > header")).getText()).slice(-2);
    await expect(todayDate - lastweekDate).toBe(7);
  });

  // Check switching back to current week
  it("check going back to current week", async () => {
    const todayDate = (await (await $(".day > header")).getText()).slice(-2);
    (await $("#prev-button")).click();
    (await $("#prev-button")).click();
    (await $("#cur-button")).click();
    const currentweekDate = (await (await $(".day > header")).getText()).slice(-2);
    await expect(todayDate - currentweekDate).toBe(0);
  })

  //  it("check adding a new task with time", async() => {
  //   (await $("#add-button")).click();
  //   (await $("#new-task-title")).setValue("New Meeting");
  //   (await $("#new-task-description")).setValue("New meeting with colleagues");
  //   const dateInput = await browser.$("#new-task-date");    
  //   await dateInput.setValue("2024");
  //   await browser.keys(["ArrowRight", '0', '6', "ArrowRight", '0', '9']);
  //   const timeInput = await browser.$("#new-task-time");
  //   await timeInput.setValue("");
  //   await browser.keys(["ArrowDown", "ArrowRight", '0', '9', "ArrowRight", '0', '0']);
  //   await browser.pause(1000);
  //   (await $("#add-task-confirm")).click();
  //   await browser.pause(5000);
  //  })
});
