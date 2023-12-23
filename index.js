const express = require('express');
const fs = require('fs');
const csvtojson = require('csvtojson');
const app = express();
const port = 3000;

function parsearNumero(valor) {
    // Reemplazar comas por puntos, eliminar puntos de separación de miles y convertir a número
    const valorLimpio = valor.replace(/,/g, '').replace(/\./g, '').replace(/[^\d.-]/g, '');
    return parseFloat(valorLimpio);
  }

function limpiarInformacion(jsonArray) {
    const resultados = {};
  
    jsonArray.forEach(item => {
      const cuenta = item.Cuenta;
      const moneda = item.Moneda;
      const liquidado = parsearNumero(item['Liquidado al: 4/09']);
    const total = parsearNumero(item.Total);
  
      if (!resultados[cuenta]) {
        resultados[cuenta] = {
          Cuenta: cuenta,
          Moneda: moneda,
          Total: 0
        };
      }
  
      // Verifica si ambos saldos son iguales, en ese caso devuelve uno de los valores
      if (liquidado == total) {
        resultados[cuenta].Total = total;
      } else {
        resultados[cuenta].Total = liquidado + total;
      }
    });
  
    // Convertir el objeto de resultados en un array
    const resultadosArray = Object.values(resultados);
  
    return resultadosArray;
  }
  
  app.get('/', (req, res) => {
    try {
      const rutaArchivo = './saldoArray.json'; // Ajusta con la ruta correcta de tu archivo JSON
      const contenidoArchivo = fs.readFileSync(rutaArchivo, 'utf-8');
      const jsonArray = JSON.parse(contenidoArchivo);
  
      // Aplica la función para limpiar la información
      const resultado = limpiarInformacion(jsonArray);
  
      res.json(resultado);
    } catch (error) {
      console.error('Error al leer el archivo JSON:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

/* app.get('/', async (req, res) => {
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
}); */

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});