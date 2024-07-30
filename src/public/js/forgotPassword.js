const form = document.getElementById("sendEmailPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const obj = {};

  formData.forEach((value, key) => (obj[key] = value));
  // console.log(obj)

  const texto = document.getElementById("sendMessage");

  // Hacer peticion para validar usuario y enviar correo
  const respuesta = await fetch("/api/users/pass-recovery", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  // const data = respuesta.json();

  if (respuesta.status === 200) {
    // Mostrar en front mensaje exitoso
    texto.innerHTML =
      "Texto enviado exitosamente, revise su bandeja de entrada";
  } else {
    // Mostrar en front mensaje de fallo

    texto.innerHTML = "Ocurrio un problema enviando su correo";
  }
});
