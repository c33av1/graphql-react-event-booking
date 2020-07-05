const User = require("../../models/user");
const Event = require("../../models/event");
const { transformEvent } = require("./merge");

module.exports = {
    events: () => {
        return Event.find()
            .populate("creator")
            .then((events) => events.map((e) => transformEvent(e)))
            .catch((e) => {
                console.log(e);
            });
    },
    createEvent: async(args, req) => {
        const { isAuth, userId } = req;
        if (!isAuth) {
            throw new Error("Unauthenticated!");
        }

        const {
            eventInput: { title, description, price, date },
        } = args;

        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: userId,
        });

        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);

            const creator = await User.findById(userId);
            if (!creator) {
                throw new Error("User does not exists");
            }

            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};