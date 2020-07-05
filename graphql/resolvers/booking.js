const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require("./merge");

module.exports = {
    bookings: async() => {
        try {
            const bookings = await Booking.find();
            return bookings.map((b) => transformBooking(b));
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async(args) => {
        const { eventId } = args;
        const fetchedEvent = await Event.findOne({ _id: eventId });

        const booking = new Booking({
            user: "5effec18a25b0f41eaa08e50",
            event: fetchedEvent,
        });

        const result = await booking.save();

        return transformBooking(result);
    },
    cancelBooking: async(args) => {
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