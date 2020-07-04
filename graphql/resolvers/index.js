const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

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
                date: new Date(e._doc.date).toISOString(),
                creator: user.bind(this, e.creator),
            }));
        })
        .catch((err) => {
            throw err;
        });
};

module.exports = {
    events: () => {
        return Event.find()
            .populate("creator")
            .then((events) => {
                return events.map((e) => {
                    return {
                        ...e._doc,
                        date: new Date(e._doc.date).toISOString(),
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
                createdEvent = {
                    ...result._doc,
                    date: new Date(result._doc.date).toISOString(),
                };
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
};