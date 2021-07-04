const mongoose = require("mongoose");

//creeating a book schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//Create a author model
const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;