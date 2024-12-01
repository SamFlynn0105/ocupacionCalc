// Función para cargar el archivo JSON
async function cargarContenido() {
  try {
    // Realiza la solicitud al archivo JSON
    const respuesta = await fetch("contenido.json");
    const respuesta1 = await fetch("config.json");
    const respuesta2 = await fetch("configCaj.json");
    const datos = await respuesta.json();
    const datos1 = await respuesta1.json();
    const datos2 = await respuesta2.json();
    total = datos1.cajones;
    ajtRec = datos2.value;

    // Asigna los datos a las etiquetas correspondientes
    document.getElementById("proyecto").textContent = datos1.proyecto;
    document.getElementById("tdes").textContent = datos.tdes;
    document.getElementById("ajuste").textContent = datos2.value;
  } catch (error) {
    console.error("Error al cargar el contenido:", error);
  }
}

// Llama a la función al cargar la página
cargarContenido();

/*ajtRec = 0;
function recAjuste() {
  ajtRec = parseFloat(document.getElementById("ajte1").value);
  console.log(ajtRec);
  //document.getElementById("saveAtj").innerText = `Se envio ajuste.`;
}*/

function calculatePercentage() {
  //const amount = parseFloat(docu ment.getElementById("inputAmount").value);
  entrada = parseFloat(document.getElementById("dataE").value);
  salida = parseFloat(document.getElementById("dataS").value);
  ajuste = ajtRec;
  calculo = entrada - (salida - ajuste);
  amount = Math.abs(calculo);
  //const total = 3516;

  if (!isNaN(amount)) {
    percentage = (amount / total) * 100;
    if (percentage < 50) {
      document.getElementById("result1").style.color = "green";
    } else if (percentage > 50 && percentage < 80) {
      document.getElementById("result1").style.color = "orange";
    } else if (percentage > 80) {
      document.getElementById("result1").style.color = "red";
    }

    //document.getElementById("result").innerText = `${amount} autos, ${percentage.toFixed(2)}% de ocupación.`;
    document.getElementById("ent").innerText = `Entrada: ${entrada}.`;
    //document.getElementById("sal").innerText = `Salida: ${salida}.`;
    //document.getElementById("ajt").innerText = `Ajuste: -${ajuste}.`;
    document.getElementById("ajt1").innerText = `Salida: ${salida - ajuste}.`;
    document.getElementById("result").innerText = `Autos en sitio: ${amount}`;
    document.getElementById("result1").innerText = `${percentage.toFixed(2)}% Ocupación`;
    mostrarHora();
  } else {
    document.getElementById("result").innerText =
      "Por favor, ingresa un número válido.";
  }
}

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  //const dataE = document.getElementById("dataE").value;
  //const dataS = document.getElementById("dataS").value;
  const dataE = entrada;
  const dataS = salida - ajuste;
  const dataA = amount;
  const dataP = percentage.toFixed(2);

  const response = await fetch("/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataE, dataS, dataA, dataP }),
  });

  if (response.ok) {
    alert("Registro guardado con éxito");
    document.getElementById("data").value = "";
  } else {
    alert("Error al guardar el registro");
  }
});

// Selección de elementos
const openPopupButton = document.getElementById("openPopup");
const closePopupButton = document.getElementById("closePopup");
const popup = document.getElementById("popup");

// Mostrar el popup al hacer clic en el botón
openPopupButton.addEventListener("click", () => {
  popup.style.display = "flex";
});

// Cerrar el popup al hacer clic en el botón de cierre
closePopupButton.addEventListener("click", () => {
  popup.style.display = "none";
});

// Cerrar el popup al hacer clic fuera del contenido del popup
window.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

function mostrarFechaHora() {
  const fecha1 = new Date();
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  document.getElementById("fechaHora").textContent = fecha1.toLocaleDateString(
    "es-ES",
    opciones
  );
}

mostrarFechaHora();
setInterval(mostrarFechaHora, 1000); // Actualiza cada segundo

function mostrarHora() {
  const fecha2 = new Date();
  const opciones1 = {
    hour: "2-digit",
    minute: "2-digit",
  };
  document.getElementById("Hora").textContent = fecha2.toLocaleDateString(
    "es-ES",
    opciones1
  );
}
//mostrarHora();

/* document.getElementById('show-records-btn').addEventListener('click', function() {
    const url = "http://localhost:3000/ver-registros";
    const width = 600; // Ancho del popup
    const height = 400; // Alto del popup
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    // Abre el popup centrado
    window.open(url, "Popup", `width=${width},height=${height},top=${top},left=${left},resizable=yes`);
});*/

document.getElementById("findreg").addEventListener("click", function () {
  const url = "http://localhost:3000/buscareg.html";
  const width = 800; // Ancho del popup
  const height = 500; // Alto del popup
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  // Abre el popup centrado
  window.open(
    url,
    "Popup",
    `width=${width},height=${height},top=${top},left=${left},resizable=yes`
  );
});

document
  .getElementById("show-records-btn")
  .addEventListener("click", async () => {
    const response = await fetch("/registros");
    const registros = await response.json();

    const recordsDiv = document.getElementById("records");
    recordsDiv.innerHTML = registros.length
      ? `
      <table>
        <thead>
          <tr>${Object.keys(registros[0])
            .map((header) => `<th>${header}</th>`)
            .join("")}</tr>
        </thead>
        <tbody>
          ${registros
            .map(
              (registro) =>
                `<tr>${Object.values(registro)
                  .map((cell) => `<td>${cell}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>`
      : "<p>No hay registros para hoy.</p>";

  });

  
function openPopup(popupId) {
  document.getElementById(popupId).style.display = "block";
  document.getElementById('overlay').style.display = "block";
}

function closePopup() {
  const popups = document.querySelectorAll('.popup1');
  popups.forEach(popup2 => popup2.style.display = 'none');
  document.getElementById('overlay').style.display = 'none';
}

function closePopup1() {
  const popups = document.querySelectorAll('.popup1');
  popups.forEach(popup2 => popup2.style.display = 'none');
  document.getElementById('overlay').style.display = 'none';
  location.reload(); // Recarga la página actual
}

//guardado de ajuste
const form = document.getElementById('dataForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('ajte1').value;

    try {
        const response = await fetch('/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: userInput })
        });

        if (response.ok) {
            message.textContent = '¡Valor guardado con éxito!';
        } else {
            message.textContent = 'Error al guardar el valor.';
        }
    } catch (error) {
        console.error('Error:', error);
        message.textContent = 'Error al conectar con el servidor.';
    }
});
