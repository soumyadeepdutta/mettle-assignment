# Mettle Assignment

This is a task I have been assigned to as an interview process.

## Overview

A node app using express framework to get and update data from a MySQL database.

## Setup

Database configuration need to set in /config/database.js

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "<db-host>",
  user: "<username>",
  password: "<password>",
  database: "erp-system",
});
```

I decided to go with pooled connection because nodejs is comparatively faster than MySQL. So if there are multiple connections in a pool, a nodejs instance will have multiple connections to database.

## Development server

This project is strictly restricted to run in production server.
To start the development server install all dependencies and

```commandLine
$ npm run dev
```

Express development server will start in http://localhost:3000 by default.

## API Usage

### 1. Get Cash-Receipts
Get all cash receipts entries between a specified transaction date range with category names. Requires start_date and end_date in query params.
```http request
curl --location --request GET 'localhost:3000/cash-receipts?start_date=2021-03-09&end_date=2021-03-09'
```
Returns a JSON Array

### 2. Get User wise Daily-Expenditure
Get user wise all daily expenditure lists along with category name. Specify user 'id' in query params. 
```http request
curl --location --request GET 'localhost:3000/expenditure?id=115'
```
Returns a JSON Array

### 3. Get User wise Remaining-Cash
Get  the remaining cash for a particular user till date. Specify user 'id' in query params. 
```http request
curl --location --request GET 'localhost:3000/remaining-cash?id=116'
```
Returns a JSON Object
### 4.  Update Customer name
Update user's name using PUT method . Specify user 'id' in query params and updated 'name' in request body.
```http request
curl --location --request PUT 'localhost:3000/update-name?id=115' 
--header 'Content-Type: application/json' 
--data-raw '{
   "name": "test"
}'
```
Returns success message.
### 5.  Update amount
Update amount using PUT method . Specify 'reference_no' in query params and updated 'amount' in request body.
```http request
curl --location --request PUT 'localhost:3000/update-amount?reference_no=1615303029872' 
--header 'Content-Type: application/json' 
--data-raw '{
    "amount": 12000
}'
```
Returns success message.

## Errors
No error handler middleware specified. 😐