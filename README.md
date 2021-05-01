# Mettle Assignment

This is a task I have been assigned to as an interview process.

## Overview

A node app using express framework to get and update data from a MySQL database.

## Setup

Database configuation need to set in /config/database.js

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "<db-host>",
  user: "<username>",
  password: "<password>",
  database: "erp-system",
});
```

I decided to go with pooled connection beacuse nodejs is comparatively faster than MySQL. So if there are multiple connections in a pool, a nodejs instance will have multiple connections to database.

## Development server

This project is strictly restricted to run in production server.
To start the development server install all dependencies and

```commandLine
$ npm run dev
```

Express development server will start in http://localhost:3000 by default.
