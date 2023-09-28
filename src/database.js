const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: true,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error al adquirir el cliente", err.stack);
  }
  client.query("SELECT * FROM users", (err, result) => {
    release();
    if (err) {
      return console.error("Error al ejecutar la consulta", err.stack);
    }
    console.log("Conexión establecida con la base de datos");
  });
});

module.exports = pool;
