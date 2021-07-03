const books = [
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

const author = [{
    id: 1,
    name: "Akib",
    books: ["12345Book"],
    },
    {
    id: 2,
    name: "Pawan",
    books: ["12345Book"],
    },
];

const publication = [{
    id: 1,
    name: "writex",
    books: ["12345Book"],
    id: 2,
    name: "black clover",
    books: [],
}];

module.exports= {books,author,publication};