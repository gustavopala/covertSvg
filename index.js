const express = require('express');
const fs = require('fs');
const csvtojson = require('csvtojson');
const app = express();
const port = 3000;


function parsearNumero(valor) {
  // Reemplazar comas por puntos, eliminar puntos de separación de miles
  const valorLimpio = valor.replace(/\./g, '').replace(/,/g, '.');

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
    if (liquidado === total) {
      resultados[cuenta].Total = total
    } else {
      const suma = liquidado + total;
      resultados[cuenta].Total = suma
    }
  });
   // Convertir el objeto de resultados en un array
   const resultadosArray = Object.values(resultados);

   return resultadosArray;
 }
   
/* const objetoDePrueba = {
  "Tipo": "COMITENTE",
		"Nivel": 0,
		"Cuenta": 107859,
		"Moneda": "PESOS",
		"Liquidado al: 4/09": "        -59.445,82",
		"A Liq": {
			"24 hs": "              0,00",
			"48 hs": "              0,00",
			"72 hs": "              0,00"
		},
		"Total": "        -59.445,82",
		"Garantia": "              0,00"
};

// Prueba de la función parsearNumero
console.log(parsearNumero(objetoDePrueba['Liquidado al: 4/09'])); // Debería imprimir -276.86
console.log(parsearNumero(objetoDePrueba.Total)); // Debería imprimir -38915898.60

// Prueba de la función limpiarInformacion
const resultadoPrueba = limpiarInformacion([objetoDePrueba]);
console.log(resultadoPrueba); // Debería imprimir el resultado esperado para este objeto */

/* function parsearNumero(valor) {
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
    if (liquidado === total) {
      resultados[cuenta].Total = total.toFixed(2);
    } else {
      const suma = liquidado + total;
      resultados[cuenta].Total = suma.toFixed(2);
    }
  });

  // Convertir el objeto de resultados en un array
  const resultadosArray = Object.values(resultados);

  return resultadosArray;
}*/
  
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