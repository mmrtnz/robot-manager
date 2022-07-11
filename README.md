# Super Cool Robotics' Rad Robot Wrangler™️

## Getting started
There are several components to the project that must get started up. I've included command-line instructions in both yarn (preferred) and npm if yarn is not available.


### Server
First create the file `server/.env` with the following content:
```
FIREBASE_API_KEY=firebase_key_provided_by_email
```

Go to your terminal and run this command to start the web server:
```
cd server
yarn install # npm install
yarn start # npm run start
```
The result will be a server running on http://localhost:8080

### Web App
Likewise, do the same to run the web app in a separate terminal:
```
cd webapp
yarn install # npm install
yarn start # npm run start
```
This will open a the app in your browser on http://localhost:3000

### Task Runner
Finally, start up the task runner to being progressing through tasks:
```
cd taskrunner
yarn install # npm install
yarn start # npm run start
```
This will open a the app in your browser on http://localhost:3000
You can login with the following fake credentials:
Username | Password
--|--
user1|user1
user2|user2
user3|user3
user4|user4


## Debugging
You'll be creating a lot of tasks when demoing the app, so I added a couple useful functions to the task runner.

`yarn reset-tasks`: Resets the progress for all tasks in the database

`yarn delete-tasks`: Removes all tasks in the database


## Architecture
![Architecture diagram](./Robot_Manager_Architecture.jpg?raw=true "Robot Manager Architecture")

## Server File Structure
- `server.js` - Initializes hapi server
- `routes.js` - Adds endpoints to server
- `/controllers` - Handle communications between server, socket, and clients
- `/services` - Facilitate interactions with database. Each file reflects a table in database


## Demo
![video demo](./robot-manager-demo.gif "Robot Manager Demo")