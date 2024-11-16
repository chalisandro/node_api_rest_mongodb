const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true
        },
        autor: {
            type: String,
            required: true,
            trim: true
        },
        genero: {
            type: String,
            enum: ['Ficción', 'No Ficción', 'Fantasía', 'Ciencia', 'Historia', 'Biografía'],
            required: true
        },
        fecha_publicacion: {
            type: String,
            required: true,

        }
    }
)
module.exports = mongoose.model('Book',bookSchema);