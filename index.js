require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

//Database import
const database = require("./database")

//Initialisation
const booky = express();

//Configuration
booky.use(express.json());

//Establish database connection
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
).then(() => console.log("connection established !!!"));


//Since our server don't understand json

/* 
Route       -> /
Description -> get all books 
Access      -> PUBLIC
parameter   -> NONE
Methods     -> GET
*/
booky.get("/", (req, res) => {
    return res.json({ books: database.books });
});

/* 
Route       -> /is
Description -> Get specific books based on ISBN
Access      -> PUBLIC
parameter   -> ISBN
Methods     -> GET
*/

booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn);

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`
        });
    }

    return res.json({ book: getSpecificBook });
});

/* 
Route       -> /c
Description -> get specific books based on category
Access      -> public
parameter   -> category
Methods     -> GET
*/

booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) =>
        book.category.includes(req.params.category)
    );

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.category} `,
        });
    }

    return res.json({ book: getSpecificBook });
});

/* 
Route       -> /author
Description -> get specific books based on category
Access      -> public
parameter   -> NONE
Methods     -> GET
*/

booky.get("/author", (req, res) => {
    return res.json({ author: database.author });
})

/* 
Route       -> /author/book
Description -> get specific authors based on books
Access      -> public
parameter   -> isbn
Methods     -> GET
*/

booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) =>
        author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthor.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.isbn} `,
        });
    }

    return res.json({ book: getSpecificAuthor });
});

/* 
Route       -> /publications
Description -> get all publication
Access      -> public
parameter   -> NONE
Methods     -> GET
*/

booky.get("/publications", (req, res) => {
    return res.json({ publications: database.publication });
});

/* 
Route       -> /book/add
Description -> add new book
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

booky.post("/book/add", (req, res) => {
    const { newBook } = req.body;

    database.books.push(newBook);
    return res.json({ books: database.books });
});
//the browser can only perform get request to perform other req we need to use helper

/* 
Route       -> /author/add
Description -> add new author
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

booky.post("/author/add", (req, res) => {
    const { newAuthor } = req.body;

    database.author.push(newAuthor);
    return res.json({ books: database.author });
});

/* 
Route       -> /publication/add
Description -> add new publication
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

booky.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;

    database.publication.push(newPublication);
    return res.json({ publications: database.publication });
});

/* 
Route       -> /publication/add
Description -> add new author
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

booky.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;

    database.publication.push(newPublication);
    return res.json({ books: database.publication });
});

/* 
Route       -> /book/update/title
Description -> update book title
Access      -> public
parameter   -> NONE
Methods     -> PUT
*/

booky.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.newBookTitle;
            return;
        }
    });

    return res.json({ books: database.books });
});
//for each directly update the data where as map first make a new array than update so in foreach theres no new array.

/* 
Route       -> /book/update/author
Description -> Update/add the author name for a book
Access      -> public
parameter   -> NONE
Methods     -> PUT
*/

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
    //update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.author.push(parseInt(req.params.authorId));
        }
    });

    //update author database
    database.author.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            return author.books.push(req.params.isbn);
        }
    });

    return res.json({
        books: database.books,
        author: database.author
    });
});

/* 
Route       -> /publication/update/book
Description -> add new new book to publication
Access      -> public
parameter   -> isbn
Methods     -> PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
    //update the publication database.
    database.publication.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({ books: database.books, publication: database.publication, message: "successfully updated publication" });
});

/* 
Route       -> /book/delete
Description -> delete a book 
Access      -> PUBLIC
parameter   -> isbn
Methods     -> DELETE
*/

booky.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;

    return res.json({ books: database.books });
});

/* 
Route       -> /book/delete/author
Description -> delete author from a book
Access      -> PUBLIC
parameter   -> isbn,authorid
Methods     -> DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {

    //update the book id
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter((author) => author !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });

    //update author database
    database.author.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter(
                (book) => book !== req.params.isbn
                );

                author.books = newBookList;
                return;
        }
    });

    return res.json({book: database.books,author: database.author});
});

/* 
Route       -> /author/delete
Description -> delete a author
Access      -> PUBLIC
parameter   -> authorId
Methods     -> DELETE
*/

booky.delete("/author/delete/:authorId", (req, res) => {
    const updatedAuthorDatabase = database.author.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );

    database.author = updatedAuthorDatabase;

    return res.json({ author: database.author });
})

/* 
Route       -> /publication/delete
Description -> delete a publication
Access      -> PUBLIC
parameter   -> pubId
Methods     -> DELETE
*/

booky.delete("/publication/delete/:pubId", (req, res) => {
    const updatedPublicationDatabase = database.publication.filter(
        (publication) => publication.id !== parseInt(req.params.pubId)
    );

    database.publication = updatedPublicationDatabase;

    return res.json({ publication: database.publication });
})

/* 
Route       -> /publication/delete/book
Description -> delete book from a publication
Access      -> PUBLIC
parameter   -> isbn,publiacation id
Methods     -> DELETE
*/

booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {

    //update publication database
    database.publication.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBookList = publication.books.filter(
                (book) => book !== req.params.isbn
                );

            publication.books = newBookList;
            return;
        }
    });

    //update the book 
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0;
            return;
        }
    });

    return res.json({book: database.books,publication: database.publication});
});


booky.listen(4000, () => console.log("Hey, the server is running! 😎"));

//mongoose helps you with validation, relationship with other data.

//mongoose model -> documrnt model of mongoDB
//document is nothing but object of your database.