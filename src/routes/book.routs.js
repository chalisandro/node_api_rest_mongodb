const express = require("express"); // Importa el paquete Express para manejar rutas.
const router = express.Router(); // Crea un enrutador de Express para manejar las rutas relacionadas con libros.
const Book = require("../models/book.model"); // Importa el modelo `Book` para interactuar con la base de datos MongoDB.

// Middleware para obtener un libro por su ID
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;  // Obtiene el parámetro `id` de la URL.

    // Verifica que el ID tenga el formato de un ObjectId válido de MongoDB (24 caracteres hexadecimales).
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: "ID de libro no es valido", // Si no es válido, retorna un error 400 (Bad Request).
        });
    }

    try {
        book = await Book.findById(id); // Busca el libro en la base de datos por su ID.
        if (!book) {
            return res.status(404).json({
                message: 'Libro no encontrado', // Si no se encuentra el libro, retorna un error 404 (Not Found).
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message, // Si hay algún error en la base de datos, retorna un error 500 (Internal Server Error).
        });
    }

    res.book = book; // Si se encuentra el libro, lo asigna a `res.book` para poder usarlo en la siguiente función.
    next(); // Pasa al siguiente middleware o ruta.
};

// Obtener y mostrar todos los libros
router.get("/", async (req, res) => {
    try {
        const books = await Book.find(); // Obtiene todos los libros de la base de datos.
        if (books.length === 0) {
            console.log("GET ALL", books);
            return res.status(404).json([]); // Si no hay libros, retorna un array vacío con un status 404.
        }
        res.json(books); // Si hay libros, los devuelve como respuesta en formato JSON.
    } catch (error) {
        res.status(500).json({
            message: error.message, // Si ocurre un error durante la consulta, retorna un error 500.
        });
    }
});

// Crear un nuevo libro
router.post("/", async (req, res) => {
    const { titulo, autor, genero, fecha_publicacion } = req.body; // Desestructura el cuerpo de la solicitud.

    // Valida que todos los campos requeridos estén presentes.
    if (!titulo || !autor || !genero || !fecha_publicacion) {
        return res.status(400).json({
            message:
                "Los campos titulo, autor, genero y fecha de publicacion son obligatorios.", // Si falta algún campo, retorna un error 400.
        });
    }

    // Crea una nueva instancia de `Book` con los datos del cuerpo de la solicitud.
    const book = new Book({
        titulo,
        autor,
        genero,
        fecha_publicacion,
    });

    try {
        const newBook = await book.save(); // Guarda el nuevo libro en la base de datos.
        console.log(newBook); // Imprime el nuevo libro en la consola.
        res.status(201).json(newBook); // Si el libro se guarda exitosamente, retorna el libro con un status 201 (Creado).
    } catch (error) {
        res.status(400).json({
            message: error.message, // Si ocurre un error al guardar el libro, retorna un error 400.
        });
    }
});

// Mostramos un Libro por su ID
router.get('/:id', getBook, async(req,res) => {
    res.json(res.book)
})

// Editar un libro por su ID 
router.put('/:id', getBook, async(req,res) => {
    try {
        const book = res.book
        book.titulo = req.body.titulo || book.titulo;
        book.autor = req.body.autor || book.autor;
        book.genero = req.body.genero || book.genero;
        book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion;

        const updateBook = await book.save()
        res.json(updateBook)
    } catch (error) {
        res.status(400).json({
            message: erro.message
        })
    }
})

// Editar momentaneamente un libro por su ID
router.patch('/:id', getBook, async(req,res) => {
    if(!req.body.titulo && !req.body.autor && !req.body.genero && !req.body.fecha_publicacion){
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: titulo, autor, genero, fecha de publicacion.'
        })
    }
    try {
        const book = res.book
        book.titulo = req.body.titulo || book.titulo;
        book.autor = req.body.autor || book.autor;
        book.genero = req.body.genero || book.genero;
        book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion;

        const updateBook = await book.save()
        res.json(updateBook)
    } catch (error) {
        req.status(400).json({
            message: erro.message
        })
    }
})

// Eliminar un libro por su ID

router.delete('/:id', getBook, async(req,res) => {
    try {
        book = res.book
        await Book.deleteOne({ _id: book._id });
        res.status(200).json({
            message: `El libro '${book.titulo}' fue eliminado correctamente.`
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// Exporta las rutas para usarlas en el archivo principal (app.js o server.js).
module.exports = router;
