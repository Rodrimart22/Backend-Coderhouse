const socket = io();
const input = document.getElementById("input");

input.addEventListener("click", (evt) => {
  const message = document.getElementById("textbox").value;
  const user = document.getElementById("user").value;

  if (user && message) {
    console.log("Se hizo click con los datos", user, message);
    const data = {
      user,
      message,
    };

    socket.emit("addMessage", data);
  }
});

socket.on("updateMessages", (messages) => {
  const chat = document.getElementById("chat");

  chat.innerHTML = "";
  if (messages.length > 0) {
    messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.innerHTML = `<p class="user"> ${message.user} dice: ${message.message} </p>`;
      chat.appendChild(messageDiv);
    });
  } else {
    chat.innerHTML = `<h1 class="message"> No se encontraron Mensajes </p>`;
  }
});
