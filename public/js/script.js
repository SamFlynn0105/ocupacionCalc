// Función para cargar el archivo JSON
async function cargarContenido() {
  try {
    // Realiza la solicitud al archivo JSON
    const respuesta = await fetch("json/contenido.json");
    const respuesta1 = await fetch("json/config.json");
    const respuesta2 = await fetch("json/configCaj.json");
  
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


function calculatePercentage() {
  // Limpia mensajes anteriores
  alertElement = document.getElementById("result123");
  alertElement.innerText = "";
  document.getElementById("ent").innerText = "";
  document.getElementById("ajt1").innerText = "";
  document.getElementById("result").innerText = "";
  document.getElementById("result1").innerText = "";

  // Obtén los valores de entrada y salida
  entrada = parseFloat(document.getElementById("dataE").value);
  salida = parseFloat(document.getElementById("dataS").value);
  ajuste = ajtRec; // Define un valor por defecto si no existe
  cajones = total;

  // Valida los valores ingresados
  if (isNaN(entrada) || isNaN(salida)) {
    alertElement.innerText = "Por favor, ingresa números válidos.";
    return;
  }

  if ((salida-ajuste) > entrada) {
    alertElement.innerText = "La salida no puede ser mayor que la entrada.";
    return;
  }

  if ((salida-ajuste) < 0) {
    alertElement.innerText = "No es posible con salida negativa.";
    return;
  }

  calculo = entrada - (salida - ajuste);
  amount = Math.abs(calculo);
  //const total = 3516; // Asegúrate de definir el total correctamente
  percentage = (amount / cajones) * 100;

  // Aplica colores según el porcentaje
  result1Element = document.getElementById("result1");
  if (percentage < 50) {
    result1Element.style.color = "green";
  } else if (percentage >= 50 && percentage < 80) {
    result1Element.style.color = "orange";
  } else {
    result1Element.style.color = "red";
  }

  // Actualiza los resultados en el HTML
  document.getElementById("ent").innerText = `Entrada: ${entrada}.`;
  document.getElementById("ajt1").innerText = `Salida: ${salida - ajuste}.`;
  document.getElementById("result").innerText = `Autos en sitio: ${amount}`;
  document.getElementById("result1").innerText = `${percentage.toFixed(2)}% Ocupación`;

  // Opcional: muestra la hora si tienes una función mostrarHora
  if (typeof mostrarHora === "function") {
    mostrarHora();
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
  document.getElementById("Hora").textContent = fecha2.toLocaleDateString("es-ES", opciones1);
}
//mostrarHora();

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

//script bannner navideño
document.addEventListener("DOMContentLoaded", () => {
  const message = document.getElementById("holiday-message");

  const today = new Date();
  const month = today.getMonth() + 1; // Mes (0-11)
  const day = today.getDate();

  if (month === 12 || month === 1) {
      if (month === 12 && day === 25) {
          message.textContent = "🎄 ¡Feliz Navidad! 🎅";
      } else if (month === 1 && day === 1) {
          message.textContent = "🎆 ¡Feliz Año Nuevo! 🥂";
      } else {
          message.textContent = "✨ ¡Felices fiestas! 🎉";
      }
  } else {
      document.getElementById("holiday-banner").style.display = "none";
  }
});


