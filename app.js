const express = require("express");
const fs = require("fs");
//const { v4: uuidv4 } = require("uuid"); // Necesitas instalar este módulo con `npm install uuid`
const app = express();

//librerias para buscar
const path = require("path");
const csv = require("csv-parser");

app.use(express.json());
app.use(express.static("public"));

// Ruta para guardar los registros
app.post("/guardar", (req, res) => {
  const { dataE } = req.body;
  const { dataS } = req.body;
  const { dataA } = req.body;
  const { dataP } = req.body;
  //const id = uuidv4();
  const now = new Date();
  const fecha = now.toLocaleDateString("es-ES"); // Formato YYYY-MM-DD
  const hora = now.toLocaleTimeString("es-ES"); // Formato HH:MM:SS

  //const registro = `${id}, ${fechaHora}, E: ${dataE}, S: ${dataS}, A: ${dataA}, P: ${dataP}%\n`;
  const registro = `${fecha},${hora},${dataE},${dataS},${dataA},${dataP}\n`;

  fs.appendFile("registro.csv", registro, (err) => {
    if (err) {
      console.error("Error al guardar el registro:", err);
      return res.status(500).send("Error al guardar el registro");
    }
    res.send("Registro guardado con éxito");
  });
});

// Helper para formatear fechas
function formatDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`; // Formato ISO para comparar
  //fecha1 = new Date(dateStr);
  //fechaFormat1= fecha1.toLocaleDateString("es-ES");
  //console.log("se ejecuta desde app: ",  fechaFormat1);
  //return fechaFormat1;
}

app.get("/buscareg.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "buscareg.html"));
});

// Ruta para filtrar datos del CSV
app.get("/filter", (req, res) => {
  const filterDate = req.query.date; // Fecha en formato DD/MM/YYYY

  if (!filterDate) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar una fecha en el formato DD/MM/YYYY" });
  }

  const results = [];
  fs.createReadStream(path.join(__dirname, "registro.csv"))
    .pipe(csv())
    .on("data", (row) => {
      if (formatDate(row.date) === formatDate(filterDate)) {
        results.push(row);
      }
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (error) => {
      res.status(500).json({ error: "Error al leer el archivo CSV" });
    });
});

app.get("/registros", (req, res) => {
  //const today = new Date().toISOString().split("T")[0]; // Fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toLocaleDateString("es-ES");
  const registrosHoy = [];

  fs.createReadStream("registro.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (row.date === today) {
        registrosHoy.push(row);
      }
    })
    .on("end", () => {
      res.json(registrosHoy);
    })
    .on("error", (error) => {
      res.status(500).json({ error: "Error leyendo el archivo CSV" });
    });
});


const DATA_FILE = path.join(__dirname, "public", 'json/configCaj.json');

// Ruta para guardar el dato en un archivo JSON
app.post('/save-data', (req, res) => {
    const { value } = req.body;

    if (!value) {
        return res.status(400).json({ error: 'El valor es requerido.' });
    }

    // Guardar el dato en un archivo JSON
    const data = { value, updatedAt: new Date().toLocaleDateString("es-ES"), updateTime: new Date().toLocaleTimeString("es-ES") };
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.status(500).json({ error: 'Error al guardar el archivo.' });
        }
        res.json({ message: 'Valor guardado con éxito.', data });
    });
});

// Ruta para leer el dato actual
app.get('/get-data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ error: 'Error al leer el archivo.' });
        }
        res.json(JSON.parse(data));
    });
});

//indexar acercade
app.get("/acercade.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "acercade.html"));
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});
