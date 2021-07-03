let books = [
    {
    ISBN: "12345Book",
    title: "Getting started with Mern",
    pubDate: "2021-07-07",
    language: "en",
    numPage: 250,
    author: [1,2],
    category: ["tech","programming","education"],
    publication: 1
    },
    {
    ISBN: "12345Two",
    title: "Getting started with C",
    pubDate: "2021-07-07",
    language: "en",
    numPage: 300,
    author: [1,2],
    category: ["tech","programming","education"],
    publication: 1
    },

];

let author = [{
    id: 1,
    name: "Akib",
    books: ["12345Book"],
    },
    {
    id: 2,
    name: "Pawan",
    books: ["12345Two"],
    },
];

let publication = [{
    id: 1,
    name: "writex",
    books: ["12345Book"],
    id: 2,
    name: "black clover",
    books: ["12345Book"],
    id: 3,
    name: "bleach",
    books: ["12345Two"],
}];

module.exports= {books,author,publication};