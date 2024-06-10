const { mdParser } = require("../../md-parser.js");

test("save and load journal to md-parser", () => {
    const journal = "# Hello World";
    mdParser.saveJournal('2018-01-01', journal);
    expect(mdParser.loadJournal("2018-01-01")).toEqual(journal);
    mdParser.deleteJournal("2018-01-01");
});