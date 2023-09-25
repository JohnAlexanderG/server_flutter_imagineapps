const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("./auth");
const pool = require("./database");
const { validatePassword } = require("./utils");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor ingrese todos los campos" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const psgQuery =
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";

  const values = [name, email, hashedPassword];

  const user = await pool.query(psgQuery, values);

  const token = generateToken(user.rows[0]);

  return res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Por favor ingrese todos los campos" });
  }

  const psgQuery = "SELECT * FROM users WHERE email = $1";

  const values = [email];
  const user = await pool.query(psgQuery, values);

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }

  const hashedPassword = user.rows[0].password;
  const isValidPassword = await validatePassword(password, hashedPassword);
  console.log("🚀 ~ file: routes.js:51 ~ router.post ~ user:", user.rows[0]);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  let token = req.headers.authorization;
  if (token && typeof token !== "undefined") {
    token = verifyToken(token.substring(7));
  } else {
    token = generateToken(user.rows[0]);
  }

  return res.status(200).json({ token });
});

router.get("/getAllTasksByUserId/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  let user = null;
  if (token && typeof token !== "undefined") {
    user = await verifyToken(token.substring(7));
  }

  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  const psgQuery = "SELECT * FROM tasks WHERE user_id = $1 ORDER BY status;";
  const values = [Number(id)];
  const result = await pool.query(psgQuery, values);

  return res.status(200).json(result.rows);
});

router.post("/createTask", async (req, res) => {
  const {
    user_id: userId,
    title,
    description,
    due_date: dueDate,
    status,
  } = req.body;
  const token = req.headers.authorization;
  let user = null;
  if (token && typeof token !== "undefined") {
    user = await verifyToken(token.substring(7));
  }

  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  const psgQuery =
    "INSERT INTO tasks (user_id, title, description, due_date, status) VALUES ($1, $2, $3, $4, $5)";
  const values = [userId, title, description, dueDate, status];
  await pool.query(psgQuery, values);

  return res.status(201).json({ message: "Tarea creada" });
});

router.put("/editTask/", async (req, res) => {
  const { id, title, description, due_date: dueDate, status } = req.body;
  const token = req.headers.authorization;
  let user = null;
  if (token && typeof token !== "undefined") {
    user = await verifyToken(token.substring(7));
  }

  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  const psgQuery =
    "UPDATE tasks SET title = $2, description = $3, due_date = $4, status = $5 WHERE id = $1;";
  const values = [id, title, description, dueDate, status];
  await pool.query(psgQuery, values);

  return res.status(200).json({ message: "Tarea actualizada" });
});

router.delete("/deleteTask", async (req, res) => {
  const { id } = req.body;
  const token = req.headers.authorization;
  let user = null;
  if (token && typeof token !== "undefined") {
    user = await verifyToken(token.substring(7));
  }

  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  const psgQuery = "DELETE FROM tasks WHERE id = $1;";
  const values = [id];
  await pool.query(psgQuery, values);

  return res.status(200).json({ message: "Tarea eliminada" });
});

module.exports = router;
