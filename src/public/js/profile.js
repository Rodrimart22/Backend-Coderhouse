// Incluye una función para obtener el valor de la cookie por nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  // Obtener el JWT almacenado en la cookie
  const jwtToken = getCookie("jwt");
  
  console.log(jwtToken);
  
  // Enviar automáticamente el JWT con cada solicitud
  fetch("/", {
    method: "GET", 
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`, 
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener los datos del usuario");
      }
      return response.json();
    })
    .then((data) => {
      // Manejar los datos de la respuesta
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
  