const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

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
                return Event.find()
                    .then((events) => {
                        return events.map((e) => {
                            return {...e._doc };
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            createEvent: (args) => {
                const {
                    eventInput: { title, description, price, date },
                } = args;

                const event = new Event({
                    title,
                    description,
                    price: +price,
                    date: new Date(date),
                });

                return event
                    .save()
                    .then((result) => {
                        console.log(result);
                        return {...result._doc };
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
        },
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