export const accountDeletedHtml = () => {
    return `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cuenta Eliminada</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              .email-container {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .message {
                  color: #fd5436;
                  margin-bottom: 10px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <h2>Cuenta Eliminada por Inactividad</h2>
              
              <p class="message">¡Hola! Tu cuenta ha sido eliminada debido a inactividad.</p>
              <p>Si deseas volver a utilizar nuestros servicios, por favor, regístrate nuevamente.</p>
          </div>
      </body>
      </html>`;
  };
  