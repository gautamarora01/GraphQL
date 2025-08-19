const Event = require("../../models/event");
const User = require("../../models/user");

const { dateToString } = require("../../helpers/date");

//Superficial functions for transforming how we return our data, also help in refactoring
const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: findUser.bind(this, event._doc.creator),
    };
};

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: findUser.bind(this,booking._doc.user),
        event: findEvent.bind(this,booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
}

//Dynamic functions to merge data instead of .populate() from mongoDB
const findUser = (userId) => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, _id: user.id, password: null, createdEvents: findEvents.bind(this, user._doc.createdEvents) };
        })
        .catch(err => {
            throw err;
        })
};

//NOTE: we can also use async/await in try catch instead of .then().catch() also
//you can find that implementation in tut.md

const findEvents = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return transformEvent(event);
            })
        })
        .catch(err => {
            throw err;
        })
};

//NOTE: there is a circular dependency among findUser, findEvents (as they call each other)
//but this does not lead to an infinite loop, because these functions
//will not be executed as long as we are not requesting that speicifc value on that specific level
//also they are called using bind which returns a function that is not immediately called

const findEvent = (eventId) => {
    return Event.findById(eventId)
    .then((event)=>{
        return transformEvent(event);
    })
    .catch(err=>{
        throw err;
    })
};

module.exports = { transformEvent, transformBooking };