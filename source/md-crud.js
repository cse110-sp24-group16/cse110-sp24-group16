import { mdParser } from "./md-parser.js";

window.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the markdown crud support by setting up popups.
 * 
 * @name crud-init
 * @function init
 */
function init() {
    const overlay = document.getElementById("overlay");
    const markdownInput = document.getElementById("markdownInput");
    const markdownPreview = document.getElementById("markdownPreview");
    const markdownPopup = document.getElementById("popup-journal");

    markdownInput.addEventListener('input', (event) => {
        const markdownText = event.target.value;
        const htmlContent = marked.parse(markdownText);
        markdownPreview.innerHTML = htmlContent;
    });

    const closePreviewButton = document.getElementById('closePopup-journal');

    closePreviewButton.addEventListener('click', function() {
        const text = markdownInput.value;

        if (text.length > 0) {
            const dateStr = closePreviewButton.dataset.date;
            mdParser.saveJournal(dateStr, text);
        }
        
        markdownPopup.style.display = 'none';
        overlay.style.display = 'none';
    });
}

/**
 * Shows the markdown journal popup for the specified date.
 * 
 * @function showPopupForMarkdown
 * @param {string} dateStr The date of the journal to edit
 */
export function showPopupForMarkdown(dateStr) {
    const overlay = document.getElementById("overlay");
    const markdownPreview = document.getElementById("markdownPreview");
    const markdownPopup = document.getElementById("popup-journal");
    const markdownPopupDate = document.getElementById("date-journal");
    const markdownText = document.getElementById('markdownInput');
    const closePreviewButton = document.getElementById('closePopup-journal');
    markdownPopupDate.textContent = "Journal for " + dateStr;
    closePreviewButton.dataset.date = dateStr;
    markdownText.value = mdParser.loadJournal(dateStr);
    const htmlContent = marked.parse(markdownText.value);
    markdownPreview.innerHTML = htmlContent;
    markdownPopup.style.display = 'block';
    overlay.style.display = 'block';
}