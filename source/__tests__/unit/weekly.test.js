// source/__tests__/unit/weekly.test.js

const { makeCalendar } = require("../../weekly-calendar.js");
const { parser } = require("../../json-parser.js");

jest.mock("../../json-parser.js", () => ({
  parser: {
    getTasks: jest.fn(),
  },
}));

describe("makeCalendar", () => {
  beforeAll(() => {
    // Mock the DOM elements used in makeCalendar
    document.body.innerHTML = `
            <div id="month-title"></div>
            <div id="calendar">
                <div id="sunday" class="day"><ul></ul></div>
                <div id="monday" class="day"><ul></ul></div>
                <div id="tuesday" class="day"><ul></ul></div>
                <div id="wednesday" class="day"><ul></ul></div>
                <div id="thursday" class="day"><ul></ul></div>
                <div id="friday" class="day"><ul></ul></div>
                <div id="saturday" class="day"><ul></ul></div>
            </div>
        `;

    // Mock getTasks to return an empty array
    parser.getTasks.mockReturnValue([]);
  });

  test("initializes the calendar with the current date", () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date();
    const tday = date.getDate();
    const tmonth = date.getMonth();
    const tyear = date.getFullYear();

    makeCalendar(tday, tmonth, tyear);

    const monthTitle = document.getElementById("month-title").textContent;
    const expectedMonthTitle = `${months[tmonth]} ${tyear}`;
    expect(monthTitle).toContain(expectedMonthTitle);

    const days = document.querySelectorAll(".day");
    days.forEach((day, index) => {
      const dayText = day.querySelector("ul").textContent;
      const expectedDay = new Date(
        tyear,
        tmonth,
        tday - date.getDay() + index
      ).getDate();
      expect(dayText).toContain(expectedDay.toString());
    });
  });
});
