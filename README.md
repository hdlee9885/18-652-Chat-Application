# 18-652-Chat-Application

This repository is a programming assignment for 18-652 Foundations of Software Engineering before the start of the semester to give students a context to demonstrate proficiency in a modern programming language, and to make sure that students are ready to tackle the course project. 

## Main Functions

1. New users can enter the site and register with their user names and passwords.
2. A registered user can sign in with the registered user name and password.
3. Logged-in users can see the number of users in the chat room.
4. Logged-in users can instantly see the chat history other users sent in the room.
5. Logged-in users can enter chat message in the text box and send messages.
6. Messages, user credentials, and time stamps are stored in the database (MongoDB here).
7. Users can click on log off button to go offline.

## Built with

Following development stacks are used in this application
* Client side: HTML, CSS, JavaScript (JS).
...+ Bootstrap
...+ jQuery
...+ font-awesome: fancy icons

* Server side: Node.js with Express.js web development framework

* Database: MongoDB with mongoose (a object data modeling library for MongoDB and Node.js)

Database schema
1. User credential information

| Field         | Data Type     | Description  |
| :-----------: |:-------------:| :--------------:|
| Name          | String        | Required, store user name |
| Password      | String        | Required, store user password |
| Status        | String        | Default is offline, switch to online when user logs in |

2. Message information

| Field         | Data Type     | Description |
| :-----------: |:-------------:| :--------------:|
| Message       | String        | Store user messages |
| Sender        | String        | Identify who sent the message|
| Timestamps    | String        | Store message sent time |






