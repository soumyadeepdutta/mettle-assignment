const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const db = require("../config/database");
const removeEmpty = require("../utils/removeEmptyValues");

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.send("working...");
});

/**
 * Get all cash receipts entries between a specified transaction date range with category names.
 */
router.get("/cash-receipts", (req, res, next) => {
  db.getConnection((err, connection) => {
    if (err) return next(createError(500));
    const sql = `SELECT *, cash_categories.category_name FROM cash_receipts INNER JOIN cash_categories ON cash_receipts.category_id=cash_categories.id  WHERE (transaction_date BETWEEN '${req.query.start_date}' AND '${req.query.end_date}')`;
    connection.query(sql, function (error, results) {
      connection.release();
      if (error) return next(createError(500));
      const data = removeEmpty(results);
      return res.json({ data });
    });
  });
});

/**
 * Get user wise all daily expenditure lists along with category name.
 */
router.get("/expenditure", (req, res, next) => {
  db.getConnection((err, connection) => {
    if (err) return next(createError(500));
    const sql = `SELECT *, expenditure_categories.category_name FROM daily_expenditures INNER JOIN expenditure_categories ON daily_expenditures.organization_id=expenditure_categories.organization_id  WHERE daily_expenditures.user_id=${req.query.id}`;
    connection.query(sql, function (error, results) {
      connection.release();
      if (error) return next(createError(500));
      const data = removeEmpty(results);
      return res.json({ data });
    });
  });
});

/**
 *  Get  the remaining cash for a particular user till date.
 */
router.get("/remaining-cash", (req, res, next) => {
  db.getConnection(async (err, connection) => {
    if (err) return next(createError(500));
    // try it with single query
    // const sql = `SELECT cash_receipts.amount, daily_revenues.amount FROM cash_receipts INNER JOIN daily_revenues ON cash_receipts.user_id=daily_revenues.user_id`;
    connection.query(
      `SELECT sum(amount) FROM cash_receipts WHERE user_id=${req.query.id}`,
      (error, cash) => {
        if (error) return next(createError(500));
        connection.query(
          `SELECT sum(amount) FROM daily_expenditures WHERE user_id=${req.query.id}`,
          (error, expenditure) => {
            if (error) return next(createError(500));
            connection.query(
              `SELECT sum(amount) FROM daily_revenues WHERE user_id=${req.query.id}`,
              (error, revenue) => {
                if (error) return next(createError(500));
                connection.release();
                cash = cash[0]["sum(amount)"];
                revenue = revenue[0]["sum(amount)"];
                expenditure = expenditure[0]["sum(amount)"];
                return res.json({
                  cash,
                  revenue,
                  expenditure,
                  remaining_cash: cash + revenue - expenditure,
                });
              }
            );
          }
        );
      }
    );
  });
});

/**
 * Update Customer name
 */

router.put("/update-name", (req, res, next) => {
  db.getConnection((err, connection) => {
    if (err) return next(createError(500));
    const sql = `UPDATE users SET name='${req.body.name}', updated_at=current_timestamp() WHERE id=${req.query.id}`;
    connection.query(sql, function (error) {
      connection.release();
      if (error) return next(createError(500));
      return res.json({
        message: "Customer name has been updated successfully",
      });
    });
  });
});

/**
 * Update amount
 */
router.put("/update-amount", (req, res, next) => {
  db.getConnection((err, connection) => {
    if (err) return next(createError(500));
    const sql = `UPDATE daily_revenues SET amount=${req.body.amount} WHERE reference_no=${req.query.reference_no}`;
    connection.query(sql, function (error) {
      connection.release();
      if (error) return next(createError(500));
      return res.json({
        message: `Amount has been updated successfully for the reference no : ${req.query.reference_no} `,
      });
    });
  });
});

module.exports = router;
