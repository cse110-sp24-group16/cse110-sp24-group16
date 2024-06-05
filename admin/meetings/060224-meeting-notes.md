# Meeting Notes

Note Taker: Sam Lau  
Missing: Jordan Huynh

# Reviewing Bugs:  

* multiple instances of same tasks when adding a task
* color for edit not working
* Tasks are not sorting my time on any day after being added

# New Issues and Improvements:

* fix the new desgin integration with parser
  * tasks should be synced up for both views again
* weekly layout change
  * the days should be in the order: SMTWTFS, so that it matches with the monthly calendar view weeks.
  * some error with the today button not working as intended (going to the week before)
* remove static tasks in task list
  * remove the 3 tasks that are hard coded in the weekly-view
* make tasks in the task list side panel load from json as well
* add journaling functionality:  
  1. book icon appears when hovering over a tasks, redirects to the journaling page/popup when clicked
  2. creates new mmddyy.md file if doesn't exist already
  3. open popup (almost whole crean, ~90% vw) in which we can input text in markdown format
  4. save text to .md file
  5. live preview implemented with: 
  6. save button somewhere that saves the file on click and closes editor popup
  7. adds an journal entry to calendar

# Concerns:
* is it nessacary to have live preivew? It seems overcomplicated and adds dependencies to project
  * Its nice for people who are in non technical people to familiarize with markup, adding accessablity. 
  * It should be a lower piority than having a working journaling function.
