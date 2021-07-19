//Prefix: /publication

//Iniatialising Express Router
const Router  = require("express").Router();

// Database model
const PublicationModel = require("../../database/publication");

/* 
Route       -> /publication
Description -> get all publication
Access      -> public
parameter   -> NONE
Methods     -> GET
*/

Router.get("/", (req, res) => {
    return res.json({ publications: database.publication });
});

/* 
Route       -> /publication/add
Description -> add new publication
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

Router.post("/add", (req, res) => {
    const { newPublication } = req.body;

    PublicationModel.create(newPublication);
    //database.publication.push(newPublication);
    return res.json({ publications: newPublication, message: "publication was added!" });
});

/* 
Route       -> /publication/update/book
Description -> add new new book to publication
Access      -> public
parameter   -> isbn
Methods     -> PUT
*/

Router.put("/update/book/:isbn", (req, res) => {
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
Route       -> /publication/delete
Description -> delete a publication
Access      -> PUBLIC
parameter   -> pubId
Methods     -> DELETE
*/

Router.delete("/delete/:pubId", (req, res) => {
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

Router.delete("/delete/book/:isbn/:pubId", (req, res) => {

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

module.exports = Router;
