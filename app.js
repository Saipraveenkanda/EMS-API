const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Replace these values with your actual PostgreSQL connection details
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: 5432, // Default PostgreSQL port
});
// console.log(pool);

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Error connecting to PostgreSQL", error));

// You can now perform database queries within this block or in separate functions.

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/employees", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM public.employees");
    // console.log("Query result:", result.rows);
    res.send(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
  }
});

app.post("/employees", async (req, res) => {
  console.log("working");
  try {
    const {
      fullName,
      dateOfBirth,
      employeeId,
      gender,
      address,
      phoneNumber,
      email,
      maritalStatus,
      jobTitle,
      dateOfHire,
      department,
      workLocation,
      manager,
      emergencyPerson,
      bloodGroup,
      emergencyPhoneNumber,
      emergencyRelation,
      laptop,
      laptopSerialNo,
      userImage,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO employees 
      (full_name, date_of_birth, employee_id, gender, address, 
        phone_number, email,marital_status,job_title,date_of_hire,
        department,work_location,manager,emergency_person,blood_group,
        emergency_phone_number,emergency_relation,laptop,laptop_serial_no,user_image) 
      VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,

      [
        fullName,
        dateOfBirth,
        employeeId,
        gender,
        address,
        phoneNumber,
        email,
        maritalStatus,
        jobTitle,
        dateOfHire,
        department,
        workLocation,
        manager,
        emergencyPerson,
        bloodGroup,
        emergencyPhoneNumber,
        emergencyRelation,
        laptop,
        laptopSerialNo,
        userImage,
      ]
    );
    res.status(200).json(result.rows[0]);
    console.log(
      `Inserted new employee in database with employee id: ${employeeId}`
    );
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});
