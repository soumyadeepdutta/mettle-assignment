const express = require("express");
const router = express.Router();

const db = require("../config/database");
const removeEmpty = require("../utils/removeEmptyValues");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("working...");
});

router.get("/cash-receipts", (req, res, next) => {
  db.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    const sql = `SELECT *, cash_categories.category_name FROM cash_receipts INNER JOIN cash_categories ON cash_receipts.category_id=cash_categories.id  WHERE (transaction_date BETWEEN '${req.query.start_date}' AND '${req.query.end_date}')`;
    // console.log(sql);
    connection.query(sql, function (error, results) {
      // When done with the connection, release it.
      // console.log(`connected with ${connection.threadId}`);
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.

      const data = removeEmpty(results);

      res.json({ data });
    });
  });
});

module.exports = router;
