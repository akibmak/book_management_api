//Prefix: /author

//Iniatialising Express Router
const Router  = require("express").Router();

// Database model
const AuthorModel = require("../../database/author");

/* 
Route       -> /author
Description -> get all author
Access      -> public
parameter   -> NONE
Methods     -> GET
*/

Router.get("/", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ author: getAllAuthors });
})

/* 
Route       -> /author
Description -> get specific authors based on books
Access      -> public
parameter   -> isbn
Methods     -> GET
*/

Router.get("/:isbn", (req, res) => {
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
Route       -> /author/new
Description -> add new author
Access      -> public
parameter   -> NONE
Methods     -> POST
*/

Router.post("/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);
    //database.author.push(newAuthor);

    return res.json({ books: newAuthor,message: "Author was added!" });
});

/* 
Route       -> /author/delete
Description -> delete a author
Access      -> PUBLIC
parameter   -> authorId
Methods     -> DELETE
*/

Router.delete("/delete/:authorId", (req, res) => {
    const updatedAuthorDatabase = database.author.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );

    database.author = updatedAuthorDatabase;

    return res.json({ author: database.author });
});

module.exports = Router;