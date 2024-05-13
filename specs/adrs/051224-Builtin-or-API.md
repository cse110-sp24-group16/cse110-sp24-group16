# Built-In Calendar or Google API

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
* __Use Google's calendar API__: We believe that a calendar is a necessary addition to the our app, but unfortunately because of the time constraints, we cannot dedicate our time solely on building a built-in calendary. Therefore, using the Google calendar API our best option considering all constraints.

## Positive Consequences:

* __Workload and Time Constraints__: By using a 3rd party API, we are able to allocate our energy and time on building other features in our app.
* __Feature Included__: By using a 3rd party API, we are able to include the calendar feature into our final build.

## Negative Consequences:

* __Reliability__: By using a 3rd party API, there is always the danger of unreliability. As we are not able to control the service quality of the API.
* __Security__: A 3rd party API will come with it's security danger as well, as we are exchanging a part of our app's security for our convenience.