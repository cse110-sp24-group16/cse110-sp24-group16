# Built-In Calendar or Google API

* Status: Approved
* Deciders: Everyone
* Date: 05/12/2024

## Context and Problem Statement

Many journals contain a calendar to better keep track of important dates and deadlines. Therefore, we need to decide should we build a calendar ourselves, which is baked in into the journal; or use a calendar API from google.

## Decision Drivers

* __Time constraints__: There are limited time that are allocated to us in this project 
* __Reliability__: We want our app to be something that our users can confidently rely on
* __Safety and Security__: Our app and code repository should be kept safe and secure

## Considered Options

* Build a built-in calendar
* Use Google's calendar API
* Not implementing a calendar

## Decision Outcome

Chosen options:
* __Build a built-in calendar__: We believe that a calendar is a necessary addition to the our app. Using Google's 3rd party API puts too many constraints on what we wish to build, so we decided to put the time and resources into making a built-in calendar for both weekly and monthly views. 

## Positive Consequences

* __Reliability__: Building our own features instead of using a 3rd party API ensures we know how the features work throughout the process. 
* __Security__: Building our own features instead of using a 3rd party API prevents possible security vulnerabilites. 
* __Feature Included__: We are able to include the calendar feature into our final build implemented the way we want it.

## Negative Consequences

* __Workload and Time Constraints__: We will be investing a lot of time, possibly restricting us building other features in our app.
