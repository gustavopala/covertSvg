const express = require('express');
const csvtojson = require('csvtojson');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    const csvFilePath = './saldo.csv';

    const jsonArray = await csvtojson({
      noheader: false,
      trim: true,
      checkType: true,
      ignoreEmpty: true,
      delimiter: ';',
      quote: '"'
    }).fromFile(csvFilePath);

    res.json(jsonArray);
  } catch (error) {
    console.error('Error al leer el archivo CSV:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});