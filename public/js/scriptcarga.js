// Función para cargar el archivo JSON
async function cargarContenido2() {
    try {
      // Realiza la solicitud al archivo JSON
      const respuesta1 = await fetch("json/config.json");
      const datos1 = await respuesta1.json();
  
      // Asigna los datos a las etiquetas correspondientes
      document.getElementById("appVersion").textContent = datos1.version;
      document.getElementById("lastUpdate").textContent = datos1.ultimaActualizacion;
      
    } catch (error) {
      console.error("Error al cargar el contenido:", error);
    }
  }
  // Llama a la función al cargar la página
  cargarContenido2();