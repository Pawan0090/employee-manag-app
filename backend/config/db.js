const { Pool } = require("pg");

const pool = new Pool({
  user: "pawanrastogi",
  host: "localhost",
  database: "employee_db",
  password: "",
  port: 5432,
});

module.exports = pool;
