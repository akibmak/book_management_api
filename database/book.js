const mongoose = require("mongoose");

//creeating a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    category: [String],
    publication: Number,
});

//Create a book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;