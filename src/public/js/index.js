//Con este socket vamos a establerecer la comunicación con nuestro servidor
const socket = io();

socket.emit('message', 'Hola es un mensaje desde el cliente');
