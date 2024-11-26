// Función para cargar el archivo JSON
async function cargarContenido() {
    try {
      // Realiza la solicitud al archivo JSON
      const respuesta = await fetch("contenido.json");
      const respuesta1 = await fetch("config.json");
      const datos = await respuesta.json();
      const datos1 = await respuesta1.json();
      total = datos1.cajones;
  
      // Asigna los datos a las etiquetas correspondientes
      document.getElementById('proyecto').textContent = datos.proyecto;
      document.getElementById('tdes').textContent = datos.tdes;
      document.getElementById('openPopup').textContent = datos.openPopup;
    } catch (error) {
      console.error('Error al cargar el contenido:', error);
    }
  }
  
  // Llama a la función al cargar la página
  cargarContenido();

function calculatePercentage() {
    //const amount = parseFloat(document.getElementById("inputAmount").value);
    entrada = parseFloat(document.getElementById("dataE").value);
    salida = parseFloat(document.getElementById("dataS").value);
    ajuste = parseFloat(document.getElementById("inputAjt").value);
    calculo = entrada - (salida - ajuste);
    amount = Math.abs(calculo);
    //const total = 3516;

    if (!isNaN(amount)) {
        percentage = (amount / total) * 100;
        if (percentage < 50)
        {
            document.getElementById("result1").style.color = "green";
        }else if (percentage >50 && percentage < 80 ) {
            document.getElementById("result1").style.color = "orange";
        }else if (percentage > 80) {
            document.getElementById("result1").style.color = "red";
        }
        
        //document.getElementById("result").innerText = `${amount} autos, ${percentage.toFixed(2)}% de ocupación.`;
        document.getElementById("ent").innerText = `Entrada: ${entrada}.`;
        //document.getElementById("sal").innerText = `Salida: ${salida}.`;
                //document.getElementById("ajt").innerText = `Ajuste: -${ajuste}.`;
                document.getElementById("ajt1").innerText = `Salida: ${salida-ajuste}.`;   
        document.getElementById("result").innerText = `Autos en sitio: ${amount}`;
        document.getElementById("result1").innerText = `${percentage.toFixed(2)}% Ocupación`;
        mostrarHora();
    
    } else {
        document.getElementById("result").innerText = "Por favor, ingresa un número válido.";
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
    body: JSON.stringify({ dataE, dataS, dataA, dataP })
});

if (response.ok) {
    alert("Registro guardado con éxito");
    document.getElementById("data").value = "";
} else {
    alert("Error al guardar el registro");
}
});

// Selección de elementos
const openPopupButton = document.getElementById('openPopup');
const closePopupButton = document.getElementById('closePopup');
const popup = document.getElementById('popup');

// Mostrar el popup al hacer clic en el botón
openPopupButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// Cerrar el popup al hacer clic en el botón de cierre
closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Cerrar el popup al hacer clic fuera del contenido del popup
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

function mostrarFechaHora() {
    const fecha1 = new Date();
    const opciones = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    document.getElementById("fechaHora").textContent = fecha1.toLocaleDateString('es-ES', opciones);
}

mostrarFechaHora();
setInterval(mostrarFechaHora, 1000); // Actualiza cada segundo

function mostrarHora() {
    const fecha2 = new Date();
    const opciones1 = { 
        hour: '2-digit', minute: '2-digit'
    };
    document.getElementById("Hora").textContent = fecha2.toLocaleDateString('es-ES', opciones1);
}
//mostrarHora();