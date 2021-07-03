const books = [{
    ISBN: "12345Book",
    title: "Getting started with Mern",
    pubDate: "2021-07-07",
    language: "en",
    numPage: 250,
    author: [1,2],
    category: ["tech","programming","education"]
}];

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
}];

module.exports= {books,author,publication};