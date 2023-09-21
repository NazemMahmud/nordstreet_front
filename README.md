# About
**Scrape Solution Frontend**

# Table of Contents

| No. | Title                             |
|-----|-----------------------------------|
| 1   | [Todos](#task-implemented)        |
| 2   | [Installation](#installation)     |
| 2   | [Implementation](#implementation) |

# Todos
**CRUD system** for the scrape back end 
1. Get/Index API, with pagination operation/events 
2. Add/update form to add or update form accordingly 
3. Delete data with a confirmation modal. 
4. Store data with scraping


# Installation

## Normal Installation
1. **Pre-requirements:** Use node version >= v16.14.0
2. Clone this repo.
3. Copy and paste from `.env.example` to `.env` file 
3. If you need to change API base url or other value, change it in the `.env` file 
4. In `package.json`, change
```angular2html
"start": "./node_modules/.bin/react-scripts start", 
```
to
```angular2html
"start: "react-scripts start"
```
4. **Install npm packages**: run `npm install`
5. Run project: `npm run start`

## Docker Installation
If you want to use docker to run this project
1. Install docker in your OS system
2. Clone this repo.
3. Copy`.env.example` and paste as `.env` in root directory.
3. Copy `docker-compose.yml.example` and paste as `docker-compose.yml` in root directory.
4. If you need to change API base url or other value, change it in the `.env` file
4. In `package.json`, change
```angular2html
"start: "react-scripts start"
```
to
```angular2html
"start": "./node_modules/.bin/react-scripts start", 
```
6. Build and up the docker containers: run `docker-compose up -d`


# Implementation
1. CRUD system
2. Pagination
3. Add & Update data form
4. Delete Confirmation modal
5. Tooltips on the icons
6. Toaster message for success and error messages
7. Loader when an event is called, such as, waiting for an API response or data update.