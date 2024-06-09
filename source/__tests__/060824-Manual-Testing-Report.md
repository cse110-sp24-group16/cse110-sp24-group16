## Manual Test Report

**Test 1**: Basic Workflow

1. Open App (App should open immediately to the task list screen) - **Pass**
2. Create Task (Task should appear on correct date and on list) - **Pass**
3. Edit Task (Task should change to reflect changes) - **Pass**
4. Delete Task (Task should be removed and have no references to it) - **Pass**
5. Open Journal Page (Journal page should open) - **Pass**
6. Journal Tasks (Tasks should appear in journal view) - **Pass**
7. Add Journal Entry (Journal entries can be made for the day) - **Pass** 
8. Edit Journal Entry - **Pass**
9. Reload App (Data should remain) - **Pass**

**Test 2**: Task List Realistic Edge Cases
1. Multiple Tasks (Adding multiple tasks to a single day should show all tasks added) - **Pass**
2. Edit Multiple Tasks (Should save properly) - **Pass**
3. Search Nonexistant Task (Nothing should show up) - **Pass**
4. Delete Multiple Tasks (Tasks should all disappear) - **Pass**
5. Filter System (Compeleted tasks should disappear when filtered) - **Pass**

**Test 3**: Journal List Realistic Edge Cases
1. Adding Journal Markdown Entry (Markdown should show in window) - **Pass**
2. Tasks From Tasklist Reflect (Tasks edited show up in their correct form) - **Pass**
3. Journal Button Response (Ensure button works) - **Pass**
4. Close Editor Before Save (Entry should not be saved) - **Pass**