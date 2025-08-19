const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//each booking is of one type of event, 
//and is booked by one type of user

const bookingSchema = new Schema ({
    event: {
        type: Schema.Types.ObjectId,
        ref: "event",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
},
{timestamps: true}
);

const Booking = mongoose.model("booking",bookingSchema);

module.exports= Booking;