const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 8080;

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

app.listen(port, () => {
    console.log('app running on '+port);
});
