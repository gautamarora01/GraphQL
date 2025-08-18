const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const findUser = (userId) => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, _id: user.id, password: null, createdEvents: findEvents.bind(this, user._doc.createdEvents) };
        })
        .catch(err => {
            throw err;
        })
};

const findEvents = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return { 
                    ...event._doc, 
                    _id: event.id, 
                    date: new Date(event._doc.date).toISOString(),
                    creator: findUser.bind(this, event.creator) 
                }
            })
        })
        .catch(err => {
            throw err;
        })
};

//NOTE: there is a circular dependency among findUser, findEvents
//but this does not lead to an infinite loop, because these functions
//will not be executed as long as we are not requesting that speicifc value on that specific level

//NOTE: we can also use async/await in try catch instead of .then().catch() also

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: findUser.bind(this, event._doc.creator),
                    };
                });
            })
            .catch(err => {
                throw err;
            });
    },
    createEvent: (args) => {

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "68a3133e5cd39a793a915038",
        });

        let createdEvent;

        return event.save()
            .then((res) => {
                createdEvent = { 
                    ...res._doc, 
                    _id: res.id, 
                    date: new Date(event._doc.date).toISOString(),
                    creator: findUser.bind(this, res._doc.creator) 
                };
                return User.findById("68a3133e5cd39a793a915038")
            })
            .then(user => {
                if (!user) {
                    throw new Error("User does not exist");
                }

                user.createdEvents.push(event);
                return user.save();
            })
            .then(res => {
                return createdEvent;
            })
            .catch((e) => {
                console.log(e);
                throw e;
            });
    },
    createUser: (args) => {

        return User.findOne({ email: args.userInput.email }).then((user) => {
            if (user) {
                throw new Error("User already exists");
            }

            return bcrypt.hash(args.userInput.password, 12);
        })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                });

                return user.save();
            })
            .then(res => {
                return { ...res._doc, password: null, _id: res.id };
            })
            .catch(err => {
                throw err;
            });
    },
}