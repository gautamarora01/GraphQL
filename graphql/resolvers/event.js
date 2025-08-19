const Event = require("../../models/event");

const { transformEvent } =  require("./merge");

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map((event) => {
                    return transformEvent(event);
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
                createdEvent = transformEvent(res);
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
}