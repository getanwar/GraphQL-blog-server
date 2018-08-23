// dotenv imports all environment variables from .env file 
// and makes them accessible from process.env
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const graphqlHTTP = require('express-graphql');
const MongoStore = require('connect-mongo')(session);

const schema = require('./schema/schema');

const port = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);
mongoose.connection.once('open', () => {
    console.log('database connected...');
});

const app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'aaabbbccc',
    store: new MongoStore({
        url: MONGO_URI,
        autoReconnect: true
    })
}));

const corsOptions = {
    credentials: true,
    origin: process.env.CLIENT_URI,
};
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log('app running on '+port);
});
