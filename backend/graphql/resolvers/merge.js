const Event = require("../../models/event");
const User = require("../../models/user");
const DataLoader = require('dataloader');

const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader((eventIds) => {
    return findEvents(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: { $in: userIds } });
});

//Instead of doing N+1 request for each of the N events,
//We batch them together into 1 request using dataloader
//instead of each request going through event loop 
//dataloader gathers all of them, and makes a single request

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
    return userLoader.load(userId.toString())
        .then(user => {
            return { ...user._doc, _id: user.id, password: null, createdEvents: () => eventLoader.loadMany(user._doc.createdEvents) };
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
            return events.map(event=>transformEvent(event));
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
    return eventLoader.load(eventId.toString())
    .then((event)=>{
        return event;
    })
    .catch(err=>{
        throw err;
    })
};

module.exports = { transformEvent, transformBooking };