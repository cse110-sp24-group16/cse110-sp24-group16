# App or Web Hosted

## Context and Problem Statement

Should the software be web or app hosted?
Should the software be focused for mobile or desktop platforms?

## Considered Options

* To use platforms that Electron encompasses
* To focus on the design on mobile usage
* To focus on the design on desktop usage

## Decision Outcome

Chosen options:
* To use platforms that Electron encompasses: 
Since we already decided on using Electron as our main development environment, the scope of platforms that our app will be compatible on should align with those that Electron includes. 
* To focus on the design on desktop usage: As our goal is mainly to improve the efficiency and productivity of developers, we decided it would be best to focus our design for the desktop, as most productive work that requires journaling would be done on the desktop. 

## Positive Consequences

* __Simplicity__: Using Electron allows us to focus on actual development of the app instead of its distributability. 

## Negative Consequences

* __Reliability__: Building the app in an Electron environment may restrict our ability to use other libraries and tools down the line. 