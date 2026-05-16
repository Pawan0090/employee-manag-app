const express = require("express");
const cors = require("cors");

const employeeRoutes = require("./routes/employees");

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Backend is running successfully"
  });
});

// Employee routes
app.use("/employees", employeeRoutes);

app.listen(5001, () => {
  console.log("Server started on port 5001");
});