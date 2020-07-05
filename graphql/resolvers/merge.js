const { dateToString } = require("../../helpers/date");
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
        .then((events) => events.map((e) => transformEvent(e)))
        .catch((err) => {
            throw err;
        });
};

const singleEvent = (eventId) => {
    return Event.findById(eventId)
        .then((event) => transformEvent(event))
        .catch((err) => {
            throw err;
        });
};

const transformEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator),
    };
};

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
    };
};

module.exports = { transformEvent, transformBooking };