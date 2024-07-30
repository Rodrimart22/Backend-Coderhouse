export const changePasswordHtml = (token) => {
  return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
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
            .login-container {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .change-message {
                color: #fd5436;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h2>Login</h2>
            
            <p class="change-message">¡Hola! Has solicitado un cambio de contraseña. Por favor, verifica tus credenciales.</p>
            <p>Haz click aquí para cambiar tu contraseña: <a href="http://localhost:8080/password-change?token=${token}">Cambiar contraseña</a></p>
        </div>
    </body>
    </html>`;
};
