const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require("./merge");

module.exports = {
    bookings: async(args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            const bookings = await Booking.find();
            return bookings.map((b) => transformBooking(b));
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async(args, req) => {
        const { isAuth, userId } = req;
        if (!isAuth) {
            throw new Error("Unauthenticated!");
        }

        const { eventId } = args;
        const fetchedEvent = await Event.findOne({ _id: eventId });

        const booking = new Booking({
            user: userId,
            event: fetchedEvent,
        });

        const result = await booking.save();

        return transformBooking(result);
    },
    cancelBooking: async(args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            const { bookingId } = args;
            const booking = await Booking.findById(bookingId).populate("event");
            const event = transformEvent(booking.event);

            await Booking.deleteOne({ _id: bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    },
};