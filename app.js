const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Necesitas instalar este módulo con `npm install uuid`
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
    const fecha = now.toLocaleDateString("es-ES");// Formato YYYY-MM-DD
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

/*// Nueva ruta para ver los registros
app.get("/ver-registros", (req, res) => {
    fs.readFile("registro.csv", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            return res.status(500).send("Error al leer los registros");
        }

        // Convierte el contenido a HTML básico
        const registrosHtml = data.split("\n").map(line => `<p>${line}</p>`).join(" ");
        res.send(`
            <html>
                <head>
                 <title>Registros Guardados</title>
                 </head>
                <body>
                    <h2>Lista de Registros</h2>
                    ${registrosHtml || "<p>No hay registros aún.</p>"}
                    <br>
                    <a href="">Actualizar</a>
                </body>
            </html>
        `);
    });
});*/

// Ruta para ver los registros del día actual
app.get("/ver-registros", (req, res) => {
    const hoy = new Date().toLocaleDateString("es-ES"); // Fecha actual en formato YYYY-MM-DD

    fs.readFile("registro.csv", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            return res.status(500).send("Error al leer los registros");
        }

        // Filtrar registros por la fecha actual
        const registrosDelDia = data
            .split("\n") // Separar las líneas
            .filter(line => line.includes(hoy)) // Filtrar las líneas que contienen la fecha actual
            .map(line => `<p>${line}</p>`) // Convertir a HTML
            .join("");

        res.send(`
            <html>
                <head><title>Registros de Hoy</title></head>
                <body>
                    <h2>Registros del Día (${hoy})</h2>
                    <p>Fecha, Hora, Entrada, Salida, Autos, Porcentaje</p>
                    ${registrosDelDia || "<p>No hay registros para el día de hoy.</p>"}
                    <br>
                    <a href="">Actualizar</a><br>
                    <a href="">Descarga archivo completo</a>
                </body>
            </html>
        `);
    });
});


// Helper para formatear fechas
function formatDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // Formato ISO para comparar
}

app.get('/buscareg.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'buscareg.html'));
});

// Ruta para filtrar datos del CSV
app.get('/filter', (req, res) => {
    const filterDate = req.query.date; // Fecha en formato DD/MM/YYYY

    if (!filterDate) {
        return res.status(400).json({ error: 'Debe proporcionar una fecha en el formato DD/MM/YYYY' });
    }

    const results = [];
    fs.createReadStream(path.join(__dirname, 'registro.csv'))
        .pipe(csv())
        .on('data', (row) => {
            if (formatDate(row.date) === formatDate(filterDate)) {
                results.push(row);
            }
        })
        .on('end', () => {
            res.json(results);
        })
        .on('error', (error) => {
            res.status(500).json({ error: 'Error al leer el archivo CSV' });
        });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});