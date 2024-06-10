let { parser } = require("../../json-parser.js");

test('add task to json-parser', () => {
    const size = parser.getTasks().length;
    const task = {
        id: '1',
        name: 'task 1',
        date: '2021-09-01',
        completed: false,
    };

    parser.addTask(task);
    const sizeAfter = parser.getTasks().length;
    expect(size + 1).toBe(sizeAfter);
    expect(parser.getTask('1')).toEqual(task);
    parser.deleteTask('1');
});

test('delete task from json-parser', () => {
    const size = parser.getTasks().length;
    const task = {
        id: '2',
        name: 'task 2',
        date: '2021-09-02',
        completed: false,
    };

    parser.addTask(task);
    const sizeAfterAdd = parser.getTasks().length;
    expect(size + 1).toBe(sizeAfterAdd);

    parser.deleteTask('2');
    const sizeAfter = parser.getTasks().length;
    expect(size).toBe(sizeAfter);
    expect(parser.getTask('2')).toBeNull();
    parser.deleteTask('2');
});

test('get task from json-parser', () => {
    const task = {
        id: '3',
        name: 'task 3',
        date: '2021-09-03',
        completed: false,
    };

    parser.addTask(task);
    expect(parser.getTask('3')).toEqual(task);
    expect(parser.getTask('4')).toBeNull();
    parser.deleteTask('3');
});