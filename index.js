require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

//Database import
// const database = require("./database")

//Models
// const BookModel = require("./database/book");
// const AuthorModel = require("./database/author");
// const PublicationModel = require("./database/publication");

//MicroServises Route
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

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

// INitialising MicroServices
booky.use("/book", Books);
booky.use("/author", Authors);
booky.use("/publication", Publications);

booky.listen(4000, () => console.log("Hey, the server is running! 😎"));

//mongoose helps you with validation, relationship with other data.
//mongoose model -> documrnt model of mongoDB
//document is nothing but object of your database.
//Since our server don't understand json
//the browser can only perform get request to perform other req we need to use helper