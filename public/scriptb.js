async function filterData() {
  const dateISO = document.getElementById("filter-date").value; // Formato ISO (YYYY-MM-DD)
  const resultsDiv = document.getElementById("results");

  if (!dateISO) {
    resultsDiv.innerHTML =
      '<p style="color: red;">Por favor, seleccione una fecha.</p>';
    return;
  }

  const dateFormatted = formatDateForBackend(dateISO);

  try {
    const response = await fetch(`/filter?date=${dateFormatted}`);
    if (!response.ok) throw new Error("Error al filtrar los datos.");

    const data = await response.json();

    if (data.length) {
      // Construir una tabla amigable
      let tableHTML = `
                <table border="1" style="margin: 20px auto; border-collapse: collapse; width: 80%;">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Autos</th>
                            <th>Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

      tableHTML += data
        .map(
          (row) => `
                    <tr>
                        <td>${row.date}</td>
                        <td>${row.Hora}</td>
                        <td>${row.Entrada}</td>
                        <td>${row.Salida}</td>
                        <td>${row.Autos}</td>
                        <td>${parseFloat(row.Porcentaje).toFixed(2)}%</td>
                    </tr>
                `
        )
        .join("");

      tableHTML += `</tbody></table>`;
      resultsDiv.innerHTML = tableHTML;
    } else {
      resultsDiv.innerHTML =
        "<p>No hay registros para la fecha seleccionada.</p>";
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

function formatDateForBackend(dateISO) {
  const [year, month, day] = dateISO.split("-");
  return `${day}/${month}/${year}`; // Conversión a DD/MM/YYYY
}

// Función para cargar el archivo JSON
async function cargarContenido() {
  try {
    // Realiza la solicitud al archivo JSON
    const respuesta = await fetch("contenido.json");
    const datos = await respuesta.json();

    // Asigna los datos a las etiquetas correspondientes
    document.getElementById("tprin").textContent = datos.tprin;
    document.getElementById("btnf").textContent = datos.btnf;
  } catch (error) {
    console.error("Error al cargar el contenido:", error);
  }
}
// Llama a la función al cargar la página
cargarContenido();
