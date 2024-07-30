const queryString = window.location.search;
const params = new URLSearchParams(queryString);

const token = params.get("token");

const message = document.getElementById("message");

// Manejar el envío del formulario
document
  .getElementById("send-password")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los valores del formulario
    const password = document.querySelector('input[name="new-password"]').value;
    const repeatPassword = document.querySelector('input[name="repeat"]').value;

    // Verificar que las contraseñas coincidan
    if (password !== repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Crear objeto de datos para enviar
    const data = {
      token: token,
      password: password,
    };

    // Realizar la solicitud de cambio de contraseña
    fetch("/api/users/pass-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 406) {
            message.innerHTML = "La contraseña no puede ser la misma";
            throw new Error("La contraseña no puede ser la misma");
          }
          message.innerHTML = "Error al actualizar la contraseña";
          throw new Error("Error al cambiar la contraseña");
        }
        return response.json();
      })
      .then((responseData) => {
        // Manejar la respuesta si es necesario
        console.log("Contraseña cambiada exitosamente:", responseData);
        message.innerHTML = "Contraseña actualizada";
        location.href = "/login";
        // Redireccionar u otra acción después de cambiar la contraseña
      })
      .catch((error) => {
        console.error("Error:", error);
        // Manejar el error
      });
  });
