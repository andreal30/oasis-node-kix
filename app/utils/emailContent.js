export const emailContent = (resetUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style> <!-- Estilos CSS para el diseño del correo (revisar si hay link para linkear prime) -->
</head>
<body>
    <p>Your link for resseting your password is ${resetUrl}
</body>
</html>`;
};
