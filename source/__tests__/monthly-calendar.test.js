import { init, makeCalendar, wipeCalendar, createDateEntry, checkToday, checkTasks, dayHoverHandler } from './path-to-your-file';
import { parser } from './json-parser';
import { showPopupForEdit, addChangeListener } from './task-crud';

jest.mock('./json-parser', () => ({
  parser: {
    getTasks: jest.fn(),
  },
}));

jest.mock('./task-crud', () => ({
  showPopupForEdit: jest.fn(),
  addChangeListener: jest.fn(),
}));

beforeEach(() => {
  document.body.innerHTML = `
    <div id="calendar"></div>
    <button id="prev-button"></button>
    <button id="cur-button"></button>
    <button id="next-button"></button>
    <div id="month-title"></div>
    <div id="popup-journal"></div>
    <div id="overlay"></div>
    <textarea id="markdownInput"></textarea>
    <div id="markdownPreview"></div>
    <button id="closePopup-journal"></button>
  `;
});

test('init should set up event listeners and initialize the calendar', () => {
  init();

  const prevButton = document.querySelector("#prev-button");
  const curButton = document.querySelector("#cur-button");
  const nextButton = document.querySelector("#next-button");

  expect(prevButton).toBeDefined();
  expect(curButton).toBeDefined();
  expect(nextButton).toBeDefined();

  // Check if the event listeners are set
  prevButton.click();
  curButton.click();
  nextButton.click();

  // Ensure the calendar is initialized
  expect(document.querySelector("#month-title").textContent).not.toBe('');
  expect(document.querySelectorAll("#calendar li").length).not.toBe(0);
});

test('makeCalendar should create calendar entries for a given month and year', () => {
  makeCalendar(5, 2023); // June 2023

  const monthTitle = document.querySelector("#month-title");
  expect(monthTitle.textContent).toBe('June 2023');

  const calendarEntries = document.querySelectorAll("#calendar li");
  expect(calendarEntries.length).toBeGreaterThan(0);
});

test('wipeCalendar should clear the calendar entries', () => {
  makeCalendar(5, 2023);
  expect(document.querySelectorAll("#calendar li").length).toBeGreaterThan(0);

  wipeCalendar();
  expect(document.querySelectorAll("#calendar li").length).toBe(0);
});

test('createDateEntry should create a calendar entry for a given date', () => {
  createDateEntry(15, 5, 2023, false); // June 15, 2023

  const calendarEntry = document.querySelector("#calendar li");
  expect(calendarEntry).toBeDefined();
  expect(calendarEntry.querySelector(".day-number").textContent).toBe('15');
});

test('checkToday should add id "today" to the current date entry', () => {
  const today = new Date();
  const liElt = document.createElement("li");
  checkToday(liElt, today.getDate(), today.getMonth(), today.getFullYear());

  expect(liElt.id).toBe("today");
});

test('checkTasks should append tasks to the date entry', () => {
  const task = { id: 1, date: '2023-06-15', title: 'Test Task', color: 'red' };
  parser.getTasks.mockReturnValue([task]);

  const ulElt = document.createElement("ul");
  checkTasks(ulElt, 15, 5, 2023); // June 15, 2023

  const taskItem = ulElt.querySelector("li.task");
  expect(taskItem).toBeDefined();
  expect(taskItem.textContent).toBe('Test Task');
});

test('dayHoverHandler should add hover effect to date entry', () => {
  const liElt = document.createElement("li");
  dayHoverHandler(liElt);

  liElt.dispatchEvent(new Event('mouseenter'));
  expect(liElt.classList.contains('day-hover')).toBe(true);

  liElt.dispatchEvent(new Event('mouseleave'));
  expect(liElt.classList.contains('day-hover')).toBe(false);
});
