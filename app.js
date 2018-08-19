const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://anwar:anwar123@ds223542.mlab.com:23542/gql1');
mongoose.connection.once('open', () => {
    console.log('database connected...');
});

const app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('app running on 4000');
});
