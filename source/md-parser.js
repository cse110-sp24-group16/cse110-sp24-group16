// md-parser.js
const fs = require("fs");
const path = require("path");
const FOLDER_NAME = path.join(__dirname, "journals");

// Create a wrapper object to hold all of the markdown parser functions for easy exporting.
const mdParser = {};

/**
 * Returns the journal entry for a given date from file.
 *
 * @name loadJournal
 * @param {String} date The date of the journal to retrieve
 * @function
 * @returns {String} Markdown Text as string
 */
mdParser.loadJournal = function (date) {
    const fileName = path.join(FOLDER_NAME, date + ".md");
    return (() => {
        try {
            return fs.readFileSync(fileName, "utf8");
        } catch (error) {
            fs.writeFileSync(fileName, "");
        }

        return "";
    })();
};

/**
 * Saves the journal entry for a given date to file.
 *
 * @name saveJournal
 * @param {String} date The date of the journal to save
 * @param {String} text The markdown text entry of the journal to save
 * @function
 * @returns {void}
 */
mdParser.saveJournal = function (date, text) {
    const fileName = path.join(FOLDER_NAME, date + ".md");
    try {
        fs.writeFileSync(fileName, text);
    } catch (err) {
        console.log("Could not save to file", err);
    }
};

/**
 * Checks if journal entry exists for a given date.
 *
 * @name hasJournal
 * @param {String} date The date of the journal to check
 * @function
 * @returns {Boolean} True if a journal entry exists for the given date, false otherwise
 */
mdParser.hasJournal = function (date) {
    const fileName = path.join(FOLDER_NAME, date + ".md");
    return fs.existsSync(fileName);
};

/**
 * Deletes the journal entry for a given date.
 *
 * @name deleteJournal
 * @param {String} date The date of the journal to delete
 * @function
 * @returns {void}
 */
mdParser.deleteJournal = function (date) {
    const fileName = path.join(FOLDER_NAME, date + ".md");
    fs.unlinkSync(fileName);
};

module.exports = { mdParser };
