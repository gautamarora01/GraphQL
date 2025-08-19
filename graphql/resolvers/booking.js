const Booking = require("../../models/booking");
const Event = require("../../models/event");

const { transformEvent, transformBooking } = require("./merge");

module.exports = {
    
    bookings: ()=>{

        return Booking.find()
        .then((bookings)=>{
            return bookings.map((booking)=>{
                return transformBooking(booking);
            });
        })
        .catch((err)=>{
            throw err;
        });
    },

    bookEvent: (args) => {

        return Event.findOne({_id: args.eventId})
        .then((fetchedEvent)=>{
            const booking  = new Booking({
                user: "68a3133e5cd39a793a915038",
                event: fetchedEvent
            });

            return booking.save();
        })
        .then((res)=>{
            return transformBooking(res);
        })
        .catch(err=>{
            throw err;
        });        
    },

    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } 
        catch (err) {
            throw err;
        }
    },
}