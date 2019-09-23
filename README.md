Python Tech Test
================

Goal
----

This repository contains an unfinished issue tracker web app. Your goal is to
make some of the following improvements to it:

Tasks Set
---------

- Fix the bug where it's not possible to add an issue titled "Can't log in"
- Fix the bug where it's not possible to close an issue
- Fix the bug where the edit screen doesn't change the description of the issue
- Make REST endpoints return a more reasonable response when requesting non-existent resources
- Add date formatting in the UI, to put timestamps in the user's local timezone
- Add a login and registration page, to enable username/password login
  - Read-only pages don't need users to be logged in, but new/edit/update pages do
  - Username must be a valid email address
  - Once this is done, add the ability to assign bugs to users, and for bugs to have creators
- Create a dashboard page with the following information:
  - How many bugs are currently open, and what percentage this is of the maximum number that were ever open at once
  - How many bugs were closed in the last week

### First Attempt

- Added Issue Closing
- Fixed Issue Editing bug
- Added non-functional user login and registration pages
- (Incorrectly) Solved the "Can't log in" issue, by escaping single quotes
- Added 404 responses to non-existant resources

Initially, I found this test to be quite challenging: Falcon and Mithrill were both new to me, so a lot of time was spent looking through documentation. The brief said the test should take 3-4 hours to complete. Addmittedly, I took a lot longer. After 8-9 hours I decided to submit the work I had done. This meant that a lot of the tasks hadn't been attempted. Most of the time was spent trying to figure out how to get user login and sessions to work.

I did not attempt to write tests for my code, which I know is bad practice. I have never used test-driven development in production before, however, this is something I am definitely keen to adopt and learn.

### Employer Feedback

#### Good:

- Python tests pass
- Used a linter
- Added issue closing
- Seemed fine with mithril
- Had a good stab at login/logout
- Issue not found impl is fine but might have been better implemented as a try/catch (catches the exception too low down and returns None, which can be a world of hurt)
- Closing, editing issues work in manual testing

#### Bad:

- Solved using Python 2.7, which is now ancient (if this was already part of the test please ignore me)
- Issue title update test fails
- Issue description update test fails
- Did not escape sql properly
- Removed ISO formatting on dates
- Apostrophe 'fix' erases apostrophes by implicit string concat... just replaces single apostrophe with double. Does not solve the issue.
- Made some function sigs more vague when it would have been easier to just add the new argument to the existing list
- Some of the easier tasks weren't attempted at all

### My response to feedback

I take all good and bad feedback on board. Although disappointed, I understood why my application could not go any further in this case.

I usually prefer python 3.6+, however, the test was given in python 2.7. I therefore decided to continue development in Python 2.7 as it was stated in the prerequisites.
As previously mentioned, I did not edit the tests in any way. The JavaScript test failures were noticed when I first downloaded and ran the tests.
After reviewing the feedback, I checked my code again and found that I had indeed removed ISO Date Formatting. This is my mistake and I should have spotted it before submitting the test.
I realise now that my 'fix' of the apostrophe bug was part of a much larger and more serious issue, and my code was prone to SQL injection attacks, which is inexcusable.

### Second attempt

I decided to pick the task up a couple of weeks after the feedback, in order to upskill and learn from the expreience.

- Properly fixed "Can't log in" error by removing string formatting and using parameters instead, removing SQL injection risk.
- Migrated Python to version 3.7
- Fixed ISO formatting
- Added dashboard page
- Added users model and got registration working, including storing passwords as PBKDF2 hash

Tasks I did not finish:

- User login: My best guess would be to have the API save an authentication cookie of some kind on the browser when the correct information is entered.
- Adding 'login required' methods to new/edit/close pages. I would have tried creating a 'login_required' decorator for the endpoints, which checks that a valid authentication cookie is included in the request, and redirects to the login page if not present.
- The number of issues open as a percentage of the max number of issues open at once. I might have been able to do this with more time.


Getting Started
---------------

### Prerequisites

- Ensure you have Python 3.7 and NodeJS 8 or higher
- Create a new virtualenv and `pip install -r requirements.txt`
- Obtain the necessary Node modules with `npm install`

### Running The App

Build UI assets with:
```
npm run-script build
```

Or have them auto-rebuild with:
```
npm run-script watch
```

And run the app with:
```
python -m bug_tracker.server
```

Run end-to-end tests with:
```
npm run-script integration-test
```
