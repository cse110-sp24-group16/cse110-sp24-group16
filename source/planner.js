//planner.js
window.addEventListener('DOMContentLoaded', init);

function init(){
    const deleteButtons = document.querySelectorAll('.delete-button');
        const popup = document.getElementById('popup-delete');
        const overlay = document.getElementById('overlay-delete');
        let currentTask;
        deleteButtons.forEach(button => {
          button.addEventListener('click', (event) => {
            currentTask = event.target.closest('.event-item');
            showPopupForDelete();
          });
        });

        document.getElementById('confirm-delete').addEventListener('click', () => {
          currentTask.remove();
          hidePopupForDelete();
        });

        document.getElementById('cancel-delete').addEventListener('click', hidePopupForDelete);
        overlay.addEventListener('click', hidePopupForDelete);

        function showPopupForDelete() {
          popup.style.display = 'block';
          overlay.style.display = 'block';
        }

        function hidePopupForDelete() {
          popup.style.display = 'none';
          overlay.style.display = 'none';
          currentTask = null;
        }
}