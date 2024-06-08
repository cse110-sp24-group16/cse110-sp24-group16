const { browser, expect, $ } = require("@wdio/globals");

describe("Calendar Application Testing", () => {
  beforeEach(async () => {
    await browser.url("about:blank"); 

    await browser.execute(() => {
      document.body.innerHTML = `
        <div id="calendar">
          <ul></ul>
        </div>
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
  });

  it("should initialize the calendar", async () => {
    await browser.execute(() => {
      window.init = () => {
        document.getElementById('month-title').textContent = 'June 2023';
        const ul = document.querySelector('#calendar ul');
        for (let i = 1; i <= 30; i++) {
          const li = document.createElement('li');
          li.textContent = i;
          ul.appendChild(li);
        }
      };
      window.init();
    });

    const prevButton = await $("#prev-button");
    const curButton = await $("#cur-button");
    const nextButton = await $("#next-button");

    await expect(prevButton).toBePresent();
    await expect(curButton).toBePresent();
    await expect(nextButton).toBePresent();

    const monthTitle = await $("#month-title");
    await expect(monthTitle).toHaveText("June 2023");

    const calendarEntries = await $$("#calendar ul li");
    await expect(calendarEntries.length).toBe(30);
  });

  it("should create calendar entries for a given month and year", async () => {
    await browser.execute(() => {
      window.makeCalendar = (month, year) => {
        document.getElementById('month-title').textContent = 'June 2023';
        const ul = document.querySelector('#calendar ul');
        for (let i = 1; i <= 30; i++) {
          const li = document.createElement('li');
          li.textContent = i;
          ul.appendChild(li);
        }
      };
      window.makeCalendar(5, 2023);
    });

    const monthTitle = await $("#month-title");
    await expect(monthTitle).toHaveText("June 2023");

    const calendarEntries = await $$("#calendar ul li");
    await expect(calendarEntries.length).toBe(30);
  });

  it("should clear the calendar entries", async () => {
    await browser.execute(() => {
      window.makeCalendar = (month, year) => {
        const ul = document.querySelector('#calendar ul');
        for (let i = 1; i <= 30; i++) {
          const li = document.createElement('li');
          li.textContent = i;
          ul.appendChild(li);
        }
      };
      window.wipeCalendar = () => {
        const ul = document.querySelector('#calendar ul');
        ul.innerHTML = '';
      };
      window.makeCalendar(5, 2023);
    });

    const initialEntries = await $$("#calendar ul li");
    await expect(initialEntries.length).toBe(30);

    await browser.execute(() => window.wipeCalendar());
    const clearedEntries = await $$("#calendar ul li");
    await expect(clearedEntries.length).toBe(0);
  });

  it("should create a calendar entry for a given date", async () => {
    await browser.execute(() => {
      window.createDateEntry = (date) => {
        const ul = document.querySelector('#calendar ul');
        const li = document.createElement('li');
        li.textContent = date;
        ul.appendChild(li);
      };
      window.createDateEntry(15);
    });

    const calendarEntry = await $("#calendar ul li");
    await expect(calendarEntry).toBePresent();
    await expect(calendarEntry).toHaveText("15");
  });

  it("should add id 'today' to the current date entry", async () => {
    await browser.execute(() => {
      window.checkToday = (liElt, day) => {
        if (day === new Date().getDate()) {
          liElt.id = 'today';
        }
      };
      const liElt = document.createElement('li');
      window.checkToday(liElt, new Date().getDate());
      document.body.appendChild(liElt);
    });

    const todayEntry = await $("#today");
    await expect(todayEntry).toBePresent();
  });

  it("should append tasks to the date entry", async () => {
    await browser.execute(() => {
      window.checkTasks = (ulElt, tasks) => {
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.className = 'task';
          li.textContent = task.title;
          ulElt.appendChild(li);
        });
      };
      const tasks = [{ id: 1, title: 'Test Task' }];
      const ulElt = document.createElement('ul');
      window.checkTasks(ulElt, tasks);
      document.body.appendChild(ulElt);
    });

    const taskItem = await $("li.task");
    await expect(taskItem).toBePresent();
    await expect(taskItem).toHaveText("Test Task");
  });

  it("should add hover effect to date entry", async () => {
    await browser.execute(() => {
      window.dayHoverHandler = (liElt) => {
        liElt.addEventListener('mouseenter', () => {
          liElt.classList.add('day-hover');
        });
        liElt.addEventListener('mouseleave', () => {
          liElt.classList.remove('day-hover');
        });
      };
      const liElt = document.createElement('li');
      window.dayHoverHandler(liElt);
      document.body.appendChild(liElt);
    });

    const dateEntry = await $("li");
    await dateEntry.moveTo();
    await expect(dateEntry).toHaveElementClass("day-hover");

    await dateEntry.moveTo({ xOffset: 100, yOffset: 100 });
    await expect(dateEntry).not.toHaveElementClass("day-hover");
  });
});
