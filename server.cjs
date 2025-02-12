const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "", 
  database: "server_labconnect", 
});

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Ruta para guardar los datos de entrada de la práctica
app.post("/guardar-entrada", (req, res) => {
  const { ampl, fecha_practica, usuario_activo, numero_practica, estado_practica, notas } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!ampl || !fecha_practica || !usuario_activo || !numero_practica || !estado_practica) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  // Insertar los datos en la tabla `practicas`
  const query =
    "INSERT INTO practicas (fecha_practica, usuario_activo, numero_practica, datos_entrada_practica, estado_practica, notas) VALUES (?, ?, ?, ?, ?, ?)";
  const datosEntradaPractica = JSON.stringify({ ampl }); // Guardar `ampl` como JSON

  connection.query(
    query,
    [fecha_practica, usuario_activo, numero_practica, datosEntradaPractica, estado_practica, notas],
    (err, results) => {
      if (err) {
        console.error("Error insertando en practicas:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      const idPractica = results.insertId; // ID de la práctica insertada
      res.json({ idPractica, message: "Práctica registrada correctamente" });
    }
  );
});

// Ruta para consultar los resultados de una práctica
app.get("/consultar-salida/:idPractica", (req, res) => {
  const { idPractica } = req.params;

  // Consultar los datos de la práctica en la tabla `practicas`
  const query = "SELECT * FROM practicas WHERE id = ?";
  connection.query(query, [idPractica], (err, results) => {
    if (err) {
      console.error("Error consultando practicas:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length > 0) {
      res.json(results[0]); // Devuelve los datos de la práctica
    } else {
      res.status(404).json({ error: "Práctica no encontrada" });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});