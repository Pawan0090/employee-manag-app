const express = require("express");
const router = express.Router();

const pool = require("../config/db");

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM employees");
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { name, email, department } = req.body;

  await pool.query(
    "INSERT INTO employees(name,email,department) VALUES($1,$2,$3)",
    [name, email, department]
  );

  res.send("Employee Added");
});

module.exports = router;
