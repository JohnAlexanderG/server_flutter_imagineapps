const express = require("express");
const router = require("./routes");
const PORT = process.env.PORT || 3080;

const app = express();

app.use(express.json());

app.use("/api/users", router);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});