# a5 HomeScreen


## How to run locally

### Dependencies

* yarn (npm should be fine but there is no package-lock.json provided)

### Steps

* make sure RethinkDB is running
* clone respository

#### Front-end
* cd into root folder
* `yarn` or `npm install` to install dependencies
* `yarn dev` or `npm run dev` to start the app in dev mode
* visit http://localhost:3000 in browser

#### Back-end
* cd into server folder
* `yarn` or `npm install` to install dependencies
* `yarn dev` or `npm run dev` to start the app in dev mode
* visit http://localhost:4000/createall to initialize database


## Brief Run-through

### Add collection page

* fill out fields with collection information
* creating new item takes user to add items page from a1
* upon creating new item, takes user back to collection page and lists the new item in current collection items
* allows for continuous item addition to collection until submittal

### Editing collections

* visit /creator_view to view better creator interface
* click Collections View to view existing collections
* click edit to edit a collection
* takes user back to add collection page with pre-populated data
* user can make changes then resubmit the collection with updates

### Editing vocab items

* when editing/creating a collection, click edit on any existing vocab item in the collection
* make any changes and submit

