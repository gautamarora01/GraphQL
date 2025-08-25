require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const authMiddleware = require("./middlewares/is-auth"); 

const PORT = process.env.PORT || 3000;
const app = express();

//Middlewares

app.use(cors({
  origin: process.env.FRONTEND_URL
}));


app.use(bodyParser.json());

app.use(authMiddleware);

app.use("/graphql",graphqlHTTP({ //we can also use /api instead of /graphql
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  //graphiql:true //provides a GUI for development
}));

//Connect to DB
mongoose.connect(`mongodb://127.0.0.1:27017/events-project`)
.then(()=>console.log("MongoDB connected"))
.catch((e)=>console.log(e));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});