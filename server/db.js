require('dotenv').config()
const mysql = require('mysql2/promise')

const {
  DB_HOST, DB_PORT = 3306, DB_USER, DB_PASSWORD, DB_NAME, DATABASE_URL
} = process.env

let pool
if (DATABASE_URL) {
  // create a pool from the connection string
  pool = mysql.createPool(DATABASE_URL)
} else if (DB_HOST && DB_USER && DB_NAME) {
  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
} else {
  console.warn('DB pool not configured. Missing DB_HOST/DB_USER/DB_NAME in env.')
}

module.exports = { pool }
