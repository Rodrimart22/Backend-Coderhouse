const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const obj = {};
  console.log(formData);
  // {
  //     email: "asdasd",
  //     password: "asdasd",
  // }
  formData.forEach((value, key) => (obj[key] = value));
  const respuesta = await fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const content = await respuesta.json();
  const { data } = content;
  console.log(data);

  if (respuesta.status === 200) {
    console.log(document.cookie);

    // Configurar la cookie con el token
    // res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
     // 1 hora de duración
    // location.href = "/api/products";
  } else {
    location.href = "/login";
  }
});

//   .then((result) => {
//     if (result.status === 200) {
//       window.location.replace("/");
//       console.log(document.cookie);
//     } else {
//       location.href = "/login";
//     }
//   });
// });
