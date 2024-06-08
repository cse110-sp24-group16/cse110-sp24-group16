const { browser, expect, $ } = require("@wdio/globals");

describe("Electron Testing", () => {
  it("should print application title", async () => {
    await expect($("h1")).toHaveText("Task List");
  });
});
