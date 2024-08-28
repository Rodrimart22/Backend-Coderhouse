const productDeletedEmail = (productName) => {
  return `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Eliminación de Producto</title>
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
              .product-deleted-container {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .deleted-message {
                  color: white;
                  margin-bottom: 10px;
              }
          </style>
      </head>
      <body>
          <div class="product-deleted-container">
              <h2>Notificación de Eliminación de Producto</h2>
              
              <p class="deleted-message">¡Hola!</p>
              <p>Lamentamos informarte que tu producto "${productName}" ha sido eliminado.</p>
              <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.</p>
          </div>
      </body>
      </html>`;
};
