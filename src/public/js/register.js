const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const obj = {};

  formData.forEach((value, key) => (obj[key] = value));
  obj.role = "USER";

  const respuesta = await fetch("/api/users/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })

  const content = await respuesta.json();
  const { data } = content;

  console.log({...content})

  if (respuesta.status === 200) {
    console.log(document.cookie);
    console.log("Fetch done successfully")
  } else {
    location.href = "/register";
  }
});
