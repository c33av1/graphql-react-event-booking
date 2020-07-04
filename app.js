const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const app = express(); // create express app object

app.use(bodyParser.json());

/* 
Express app api 
app.get("/", (req, res, next) => {
    res.send("Hello World!");
}); */

/**
 * [String!] - will always return list of strings and not list of nullable values
 * [String!]! - will always return list of strings and not null
 */
app.use(
    "/graphql",
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3000, () => console.log("listening at 3000"));
    })
    .catch((err) => {
        console.log(err);
    });