const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const obj = {};

  formData.forEach((value, key) => (obj[key] = value));
  const respuesta = await fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (respuesta.status === 200) {
    // Redirigir al usuario a "/"
    location.href = "/";
  } else {
    // Redirigir al usuario a la página de inicio de sesión
    location.href = "/login";
  }
});
