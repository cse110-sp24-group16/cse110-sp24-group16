# Code Review Policy for GitHub Repository

* Status: Approved
* Deciders: Everyone
* Date: 05/12/2024

## Context and Problem Statement

In our software development process, it is crucial to maintain high code quality and ensure that all code contributions are thoroughly reviewed and tested before they are integrated into the main product. There is a need to formalize the code review and integration process to minimize errors, improve code quality, and ensure consistency across the project.

## Decision Drivers

* **Code Quality:** Ensure high standards of code quality and consistency in the codebase.
* **Team Collaboration:** Facilitate effective collaboration among team members.
* **Error Reduction:** Reduce bugs and issues in the production environment.
* **Process Clarity:** Define clear and understandable processes for all team members.

## Considered Options

1. **Feature Branch Workflow:** Developers create individual branches for features which are merged back to the main branch with one code review from dev.
2. **Pull Request from Dev to Main Branch:** Incorporate a two-branch structure where the `main` branch serves as the final product, and a `dev` branch serves as the pre-production integration branch, with strict review and testing protocols.

## Decision Outcome

Chosen option: 
* **Pull Request from Dev to Main Branch:**: because it ensures a higher standard of code review and testing while enabling continuous integration and delivery in a controlled manner.

### Positive Consequences

* **Enhanced Code Quality:** With mandatory reviews and tests, code merged into the main product is more likely to be robust and reliable.
* **Reduced Errors:** Early detection and resolution of issues before they reach the main branch.
* **Clear Responsibility:** Clear separation of development and production-ready code.
* **Team Accountability:** Increased involvement and accountability of team members in the code review process.

### Negative Consequences

* **Potential Delays:** The process may introduce delays in feature deployment due to the multiple stages of review.
* **Resource Intensity:** Requires more resources and time from team members to conduct thorough reviews.

## Detailed Solution

* **Main Branch:** This branch will serve as the final product. All commits to this branch will occur via pull requests from the `dev` branch only. Each pull request requires:
  - Passing automatic tests to ensure baseline quality and functionality.
  - Reviews and approvals from at least 3 team members to ensure thorough oversight and collaboration.

* **Dev Branch:** This branch will serve as the integration branch for development. Changes to this branch will also occur through pull requests, but from other feature branches or bug fix branches. Each pull request requires:
  - Passing automatic tests similar to the main branch.
  - Review and approval from at least 1 team member to ensure initial code quality before further integration.

By implementing this policy, we aim to enhance the quality of our software products and streamline our development process, ensuring that all code meets our standards before being deployed.

