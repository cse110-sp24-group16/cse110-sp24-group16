# localstorage or JSON

## Context and Problem Statement

Should the task data be stored in and loaded from localstorage or JSON file?

## Considered Options

* To load task data from and be able to add data to localstorage
* To load task data from and be able to update a JSON file

## Decision Outcome

Chosen options:
* To load task data from and be able to update a JSON file: 
In practical use of the app, it would make more sense to have it stored on a JSON file so the task list
isn't restricted to one device. Also, since we are planning to parse from a JSON file anyway, there is 
no need to move data back and forth from localstorage. 