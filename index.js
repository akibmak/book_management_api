require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

//Database import
const database = require("./database")

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

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
booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/* 
Route       -> /is
Description -> Get specific books based on ISBN
Access      -> PUBLIC
parameter   -> ISBN
Methods     -> GET
*/

booky.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})

    // const getSpecificBook = database.books.filter(
    //     (book) => book.ISBN === req.params.isbn);

    if (!getSpecificBook) {
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

booky.get("/c/:category", async (req, res) => {

    const getSpecificBooks = await BookModel.findOne({category: req.params.category});

    // const getSpecificBook = database.books.filter((book) =>
    //     book.category.includes(req.params.category)
    // );

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the category of ${req.params.category} `,
        });
    }

    return res.json({ book: getSpecificBooks });
});

/* 
Route       -> /author
Description -> get all author
Access      -> public
parameter   -> NONE
Methods     -> GET
*/

booky.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ author: getAllAuthors });
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

booky.post("/book/add", async (req, res) => {
    const { newBook } = req.body;

    const addNewBook = BookModel.create(newBook);

   // database.books.push(newBook);
    return res.json({ books: addNewBook, message: "book was added!" });
});
//the browser can only perform get request to perform other req we need to use helper

/* 
Route       -> /author/new
Description -> add new author
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

booky.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);
    //database.author.push(newAuthor);

    return res.json({ books: newAuthor,message: "Author was added!" });
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

    PublicationModel.create(newPublication);
    //database.publication.push(newPublication);
    return res.json({ publications: newPublication, message: "publication was added!" });
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

booky.put("/book/update/title/:isbn", async (req, res) => {

    // database.books.forEach((book) => {
    //     if (book.ISBN === req.params.isbn) {
    //         book.title = req.body.newBookTitle;
    //         return;
    //     }
    // });

    // return res.json({ books: database.books });
 
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.bookTitle,
        },
        {
            new: true,
        }
    );

    return res.json({books: updatedBook});
});
//for each directly update the data where as map first make a new array than update so in foreach theres no new array.

/* 
Route       -> /book/update/author
Description -> Update/add the author 
Access      -> public
parameter   -> isbn
Methods     -> PUT
*/

booky.put("/book/update/author/:isbn", async (req, res) => {

    //update book database
    // database.books.forEach((book) => {
    //     if (book.ISBN === req.params.isbn) {
    //         return book.author.push(parseInt(req.params.authorId));
    //     }
    // });

    //update author database
    // database.author.forEach((author) => {
    //     if (author.id === parseInt(req.params.authorId)) {
    //         return author.books.push(req.params.isbn);
    //     }
    // });

    // return res.json({
    //     books: database.books,
    //     author: database.author
    // });

    //Upadate the Book databse
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $push: {
                authors: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    //update the author model
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New Author was added!"
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