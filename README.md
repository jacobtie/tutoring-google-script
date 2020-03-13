# Setup Instructions

## Labeling emails:

Go to gmail
In the search box, search "[Appointment Notification] Course-based Tutoring"
Click the down arrow on the search box
Click Create Filter at the bottom
Check Apply the Label
Click New Label..
Enter "Unprocessed Appt"
Click create
Click create filter

## Installing the script:

Clone the repository to your local system
At line 74, replace my name with your own `Tutoring Appt w/ <YOUR NAME> and ...`
Download node.js
Run `npm install` in the cloned directory
Run `npx clasp login`
Pick your school account
Run `npx clasp create`
Pick Standalone
It should fail, follow the directions, click the link, make sure you are in the right account, enable API
Run `npx clasp create`
Pick Standalone
Run `npx clasp push`
Go to app scripts dashboard
Open your project code
Click Resources > Advanced Google services..
Enable your terms and conditions, make sure it is using the correct Google account
Back in the dashboard, Click the three dots on the project
Click triggers

Add trigger
Pick the settings: main, Head, time-driven, minutes timer, every minute, notify me immediately
Allow permissions
