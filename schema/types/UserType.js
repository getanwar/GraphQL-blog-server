const {
    GraphQLID,
    GraphQLString,
    GraphQLObjectType
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString }
    })
});

module.exports = UserType;