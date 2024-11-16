const { config } = require("dotenv")//1. Importa la función `config` desde el paquete dotenv.
const express = require('express')//2. Importa el paquete express para crear la aplicación web.
const mongoose = require('mongoose')// 3. Importa el paquete mongoose para interactuar con MongoDB.

config()// 4. Llama a `config()` para cargar las variables de entorno desde el archivo `.env`.

const app = express()// 5. Crea una instancia de la aplicación Express.
const port = process.env.PORT || 3000// 6. Establece el puerto del servidor utilizando una variable de entorno, o usa el puerto 3000 por defecto.

const bodyParser = require('body-parser')// 7. Importa el paquete body-parser para poder analizar los cuerpos JSON de las solicitudes.
const bookRoutes = require('./routes/book.routs');// 8. Importa las rutas de los libros desde un archivo en tu proyecto.

app.listen(port, () => console.log(`App listening on port ${port}!`))

app.use(bodyParser.json())// 9. Usa el middleware bodyParser para analizar cuerpos de solicitudes JSON.

mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME}) // Conectamos a la url nuestra base de datos

const db = mongoose.connection;

app.use('/books', bookRoutes)

