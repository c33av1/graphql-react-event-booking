const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

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

const singleEvent = (eventId) => {
    return Event.findById(eventId)
        .then((event) => {
            return {
                ...event._doc,
                creator: user.bind(this, event._doc.creator),
            };
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
    bookings: async() => {
        try {
            const bookings = await Booking.find();
            return bookings.map((b) => ({
                ...b._doc,
                createdAt: new Date(b._doc.createdAt.toISOString()),
                updatedAt: new Date(b._doc.updatedAt.toISOString()),
                user: user.bind(this, b._doc.user),
                event: singleEvent.bind(this, b._doc.event),
            }));
        } catch (err) {
            throw err;
        }
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
    bookEvent: async(args) => {
        const { eventId } = args;
        const fetchedEvent = await Event.findOne({ _id: eventId });

        const booking = new Booking({
            user: "5effec18a25b0f41eaa08e50",
            event: fetchedEvent,
        });

        const result = await booking.save();

        return {
            ...result._doc,
            createdAt: new Date(result._doc.createdAt),
            updatedAt: new Date(result._doc.updatedAt),
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
        };
    },
    cancelBooking: async(args) => {
        try {
            const { bookingId } = args;
            const booking = await Booking.findById(bookingId).populate("event");
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator),
            };

            await Booking.deleteOne({ _id: bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    },
};