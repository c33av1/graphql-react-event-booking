const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express(); // create express app object

app.use(bodyParser.json());

const user = (userId) => {
    return User.findById(userId)
        .then((user) => {
            return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents),
            };
        })
        .catch((err) => {
            throw err;
        });
};

const events = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then((events) => {
            return events.map((e) => ({
                ...e._doc,
                creator: user.bind(this, e.creator),
            }));
        })
        .catch((err) => {
            throw err;
        });
};
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
            creator: User!
          }

          type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
          }

          input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
          }

          input UserInput {
            email: String!
            password: String!
          }

          type RootQuery {
            events: [Event!]!

          }

          type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
          }

          schema {
            query: RootQuery
            mutation: RootMutation
          }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                    .populate("creator")
                    .then((events) => {
                        return events.map((e) => {
                            return {
                                ...e._doc,
                                creator: user.bind(this, e._doc.creator),
                            };
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
                    creator: "5efff00af88e58427edb26d6",
                });

                let createdEvent;
                return event
                    .save()
                    .then((result) => {
                        createdEvent = {...result._doc };
                        return User.findById("5efff00af88e58427edb26d6");
                    })
                    .then((user) => {
                        if (!user) {
                            throw new Error("User does not exists");
                        }

                        user.createdEvents.push(event);
                        return user.save();
                    })
                    .then((result) => createdEvent)
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
            createUser: (args) => {
                const {
                    userInput: { email, password },
                } = args;

                return User.findOne({ email })
                    .then((user) => {
                        if (user) {
                            throw new Error("User exists already.");
                        }

                        return bcrypt.hash(password, 12);
                    })
                    .then((hashedPassword) => {
                        const user = new User({
                            email,
                            password: hashedPassword,
                        });

                        return user.save();
                    })
                    .then((result) => {
                        console.log(result);
                        return {...result._doc, password: null };
                    })
                    .catch((err) => {
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