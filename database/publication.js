const mongoose = require("mongoose");

//creeating a book schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//Create a Publication model
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;