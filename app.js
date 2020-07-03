const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express(); // create express app object

// TODO - remove when linked with DB
const events = [];

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
          type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
          }

          input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
          }

          type RootQuery {
            events: [Event!]!
          }

          type RootMutation {
            createEvent(eventInput: EventInput): Event
          }

          schema {
            query: RootQuery
            mutation: RootMutation
          }
        `),
        rootValue: {
            events: () => {
                return events;
            },
            createEvent: ({ eventInput: { title, description, price } }) => {
                const event = {
                    _id: Math.random().toString(),
                    title,
                    description,
                    price: +price, // convert to float or int
                    date: new Date().toISOString(),
                };

                events.push(event);
                return event;
            },
        },
        graphiql: true,
    })
);

app.listen(3000, () => console.log("listening at 3000"));