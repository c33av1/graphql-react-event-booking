const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

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
        schema: buildSchema(`
          type RootQuery {
            events: [String!]!
          }

          type RootMutation {
            createEvent(name: String): String
          }

          schema {
            query: RootQuery
            mutation: RootMutation
          }
        `),
        rootValue: {
            events: () => {
                return ["Cooking", "Sailing", "All night coding"];
            },
            createEvent: ({ name }) => {
                return name;
            },
        },
        graphiql: true,
    })
);

app.listen(3000, () => console.log("listening at 3000"));