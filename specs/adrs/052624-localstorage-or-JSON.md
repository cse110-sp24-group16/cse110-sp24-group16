# localstorage or JSON

* Status: Approved
* Deciders: Everyone
* Date: 05/26/2024

## Context and Problem Statement

Should the task data be stored in and loaded from localstorage or JSON file?

## Considered Options

* To load task data from and be able to add data to localstorage
* To load task data from and be able to update a JSON file

## Decision Outcome

Chosen option:
* To load task data from and be able to update a JSON file: 
In practical use of the app, it would make more sense to have it stored on a JSON file so the task list
isn't restricted to one device. Also, since we are planning to parse from a JSON file anyway, there is 
no need to move data back and forth from localstorage. 

## Positive Consequences

* __Accessibility__: Users will be able to access their information on multiple devices, if we choose to push the features that far.

## Negative Consequences

* __Workload and Time Constraints__: It will require more dev time in order to design, create, and test, since using reading from and writing to a JSON file is more technical than to local storage. 
* __Performance__: Even if negligible, using a JSON file will likely run slower than writing to localstorage in an offline environment. 