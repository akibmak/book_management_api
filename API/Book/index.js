//Prefix: /book

//Iniatialising Express Router
const Router  = require("express").Router();

// Database model
const BookModel = require("../../database/book");

/* 
Route       -> /
Description -> get all books 
Access      -> PUBLIC
parameter   -> NONE
Methods     -> GET
*/
Router.get("/", async (req, res) => {
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

Router.get("/:isbn", async (req, res) => {

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

Router.get("/c/:category", async (req, res) => {

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
Route       -> /book/new
Description -> add new book
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

Router.post("/new", async (req, res) => {
    try{
        const { newBook } = req.body;

        await BookModel.create(newBook);

        // database.books.push(newBook);
        return res.json({ message: "book was added!" });
    }catch (error){
        //throw new Error(error);
        return res.json({error: error.message});
    }
    
});

/* 
Route       -> /book/update/title
Description -> update book title
Access      -> public
parameter   -> NONE
Methods     -> PUT
*/

Router.put("/update/title/:isbn", async (req, res) => {

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

    // database.books.forEach((book) => {
    //     if (book.ISBN === req.params.isbn) {
    //         book.title = req.body.newBookTitle;
    //         return;
    //     }
    // });

    // return res.json({ books: database.books });
 
});
//for each directly update the data where as map first make a new array than update so in foreach theres no new array.

/* 
Route       -> /book/update/author
Description -> Update/add the author 
Access      -> public
parameter   -> isbn
Methods     -> PUT
*/

Router.put("/update/author/:isbn", async (req, res) => {

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

});

/* 
Route       -> /book/delete
Description -> delete a book 
Access      -> PUBLIC
parameter   -> isbn
Methods     -> DELETE
*/

Router.delete("/delete/:isbn", async (req, res) => {
    
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    // const updatedBookDatabase = database.books.filter(
    //     (book) => book.ISBN !== req.params.isbn
    // );

    // database.books = updatedBookDatabase;

    // return res.json({ books: database.books });


});

/* 
Route       -> /book/delete/author
Description -> delete author from a book
Access      -> PUBLIC
parameter   -> isbn,authorid
Methods     -> DELETE
*/

Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull: {
                authors: parseInt(req.params.authorId)
            }
        },
        {
            new: true
        }
    );

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId)
        },
        {
            $pull: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    // update the book id
    // database.books.forEach((book) => {
    //     if (book.ISBN === req.params.isbn) {
    //         const newAuthorList = book.author.filter((author) => author !== parseInt(req.params.authorId));
    //         book.author = newAuthorList;
    //         return;
    //     }
    // });

    // update author database
    // database.author.forEach((author) => {
    //     if (author.id === parseInt(req.params.authorId)) {
    //         const newBookList = author.books.filter(
    //             (book) => book !== req.params.isbn
    //             );

    //             author.books = newBookList;
    //             return;
    //     }
    // });

    // return res.json({book: database.books,author: database.author});

    //update book database
    
});




module.exports = Router;