const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./database");
const getUserByToken = require("./utils");

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

  const result = await pool.query(psgQuery, values);

  return res.status(201).json(result.rows[0]);
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
  const result = await pool.query(psgQuery, values);

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Contraseña incorrecta" });
  }

  const token = bcrypt.hashSync(user.email + Date.now(), 10);

  const tokenQuery = "UPDATE users SET token = $1 WHERE id = $2 RETURNING *";

  const tokenValues = [token, user.id];
  await pool.query(tokenQuery, tokenValues);

  return res.status(200).json({ token });
});

router.post("/tasks", async (req, res) => {
  const { user_id: userId, title, description, due_date: dueDate, status } = req.body;
  const token = req.headers.authorization;
  const user = await getUserByToken(token);

  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  const psgQuery =
    "INSERT INTO tasks (user_id, title, description, due_date, status) VALUES ($1, $2, $3, $4, $5)";
  const values = [userId, title, description, dueDate, status];
  await pool.query(psgQuery, values);

  return res.status(201).json({ message: "Tarea creada" });
});



module.exports = router;
