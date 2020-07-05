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
    createEvent: async(args) => {
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
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);

            const creator = await User.findById("5efff00af88e58427edb26d6");
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