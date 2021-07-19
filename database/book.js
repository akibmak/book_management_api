const mongoose = require("mongoose");

//creeating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 10
    }, //required
    title: 
        {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 10
        }
    ,
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    category: [String],
    publication: Number,
});

//Create a book model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;