Docs -> https://www.graphql-js.org/docs/
https://graphql.org/learn/ 

Q. What is GraphQL?

->An alternative to REST API which is a stateless, client-independent API for exhchanging data (has two endpoints)

-> GraphQL is also a stateless, client-independent API for exhchanging data, but with higher query flexibility.
(Invented by Facebook)

-> Suppose we need to get a user's post, then we will send
GET request to /post endpoint, where we will fetch and return all the data regarding the post.
Now suppose we just needed the id and title for this post,
one way is creating another REST API endpoint (problem will be lots of endpoint creation and updation)
Another way is using query parameters on this endpoint
/post?data=id (still we need handle new logic at each endpoint)
Or we can use GraphQL, where we can build a backend that exposes one endpoint which is flexible to the kind of query it receives

->With GraphQL we always send a POST request only  (even if we want to get data), to a single endpoint only, typically named /graphql.
The reason for this is because GraphQL exposes a query language to the frontend, and frontend can now send a query expression on this POST Request to backend to define the data that should be returned.
This query expression is sent in the POST body. (we cannot use a GET request because they do not have a POST Body)

->Some other benefits: GraphQL allows filtering of data at the server side rather than over-fetching at client side and then filtering. In a microservices environment, GraphQL can act as an API gateway, consolidating data from various microservices into a unified schema, simplifying client interactions

-> {
    query {
        user {
            name
            age
        }
    }
}

query -> Operation Type (other operation types are mutation, subscription)
user -> Operation "endpoint"
name,age -> Requested fields

-> Opetation Types ->
query -> Retrieve Data ("GET")
mutation -> Manipulate Data ("POST","PUT","PATCH","DELETE")
subscription -> Set up realtime connections via Websockets

Q. GraphQL in a big picture?

-> Client sends a POST request to server at /graphql endpoint
, server has query definitions, mutation definitions, subscription definitions defined on it, along with type definition (we use types so that we know which type of data is returned or edited), then we have resolvers (or controllers for REST API) which contains the logic for different actions that have to performed for each hit.

Q. packages 

-> express-graphql -> used as a middleware in express applications, that routes request to a parser and then handle it according to our schema, then forward them to right resolver 

-> graphql -> allow us to define the graphql schema

//Building an Event Booking Application


Way - 1 -> .then().catch()

<!-- const findUser = (userId) => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, _id: user.id, password: null, createdEvents: findEvents.bind(this, user._doc.createdEvents) };
        })
        .catch(err => {
            throw err;
        })
}; -->

Way - 2 -> async/await

<!-- const findUser = async (userId) => {

    try {
        const userFoundById = await User.findById(userId);
        return { 
            ...userFoundById._doc,
            _id: userFoundById.id, 
            password: null, 
            createdEvents: findEvents.bind(this,         userFoundById._doc.createdEvents) 
      }; 
    } 
    catch (err) {
       throw err;
    }        
}; -->

NOTE: what is the difference between just doing event.creator & event._doc.creator?
-> Both work fine actually, the difference is _doc contains just the data, whereas in the case we do not use it we are also sending metadata which we might not want to return it

NOTE: In Schema, '!' -> means the value cannot be null
[String!]! -> means array of strings, where string is also not null, and the array can also not be null

How bcrypt matches plain text password submitted to the original hash in the DB?

Receive Password and Hash: The user submits their password, and you retrieve the corresponding stored hash from your database. The stored hash is the output of a previous bcrypt operation on the user's original password.

Re-hashing: The bcrypt library takes the plain-text password provided by the user and the stored hash as input. It then extracts the salt from the stored hash. The salt is a random string that was used to create the original hash, and it's stored as part of the bcrypt hash string itself.

The library then takes this extracted salt and uses it to re-hash the user's newly submitted plain-text password. This is a critical step because it ensures that the same salt is used for both hashing operations.

Comparison: The bcrypt algorithm then compares the newly generated hash with the original stored hash. If the two hashes match, the passwords are the same. If they don't, the passwords are different.

To create hashed password initially while signup ->bcrypt.hash(password, 12);

To compare the two passwords during login -> 
bcrypt.compare(submittedPassword, hashedPasswordInDb)

NOTE: we should always give away same error message if user does not exist or password is incorrect and it should be invalid credentials. (so that no info is given out)