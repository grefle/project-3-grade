const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

// Налаштування обробки запитів та маршрутів

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname)); // Дозволяє обслуговувати статичні файли (наприклад, стилі CSS та JavaScript файли)

app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});
