const express = require("express");
const router = require("./routes");

const app = express();

app.use(express.json());

app.use("/api/users", router);

app.listen(3080, () => {
  console.log("Servidor iniciado en http://localhost:3080");
});