const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt
} = require('graphql');

// Helpers
const filterArgs = require('../util/filterArgs');
const AuthServices = require('../services/auth');

//Types
const UserType = require('./types/UserType');

// Models
const PostModel = require('../models/PostModel');
const AuthorModel = require('../models/AuthorModel');
const CategoryModel = require('../models/CategoryModel');
const CommentModel = require('../models/CommentModel');

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        datetime: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { 
            type: AuthorType,
            resolve(parent, args) {
                return AuthorModel.findById(parent.authorId);
            }
        },
        category: { 
            type: CategoryType,
            resolve(parent, args) {
                return CategoryModel.findById(parent.categoryId);
            }
        },
        comments: {
            type: CommentType,
            resolve(parent, args) {
                //
            }
        }
    })
});

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return PostModel.find({categoryId: parent.id});
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        website: { type: GraphQLString },
        comment: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return AuthorModel.findById(parent.authorId);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args) {
                return PostModel.findById(parent.postId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return PostModel.find({ authorId: parent.id});
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return CommentModel.find({ authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return PostModel.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return PostModel.find({});
            }
        },
        category: {
            type: CategoryType,
            args: {
                id: { type: GraphQLID },
                slug: { type: GraphQLString }
            },
            resolve(parent, args) {
                if(args.id) {
                    return CategoryModel.findById(args.id);
                }
                return CategoryModel.findOne({ slug: args.slug });
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args) {
                return CategoryModel.find({});
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            args: {
                postId: { type: GraphQLString },
                authorId: { type: GraphQLString }
            },
            resolve(parent, args) {
                if(!Object.keys(args).length) {
                    return CommentModel.find({});
                }
                const filter = {};
                for(let key in args) {
                    if(args[key]) {
                        filter[key] = args[key]
                    }
                }
                return CommentModel.find(filter);
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return AuthorModel.findById(args.id);
            }
        },
        authUser: {
            type: UserType,
            resolve(parent, args, req) {
                return req.user;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, { email, password }, req) {
                return AuthServices.signup({ email, password, req });
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, { email, password }, req) {
                return AuthServices.login({ email, password, req });
            }
        },
        logout: {
            type: UserType,
            resolve(parent, args, req) {
                const user = req.user;
                req.logout();
                return user;
            }
        },
        addPost: {
            type: PostType,
            args: {
                title: { type: GraphQLString },
                content: { type: GraphQLString },
                authorId: { type: GraphQLID },
                categoryId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const { title, content, authorId, categoryId } = args;
                let post = new PostModel({ title, content, authorId, categoryId });
                return post.save();
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const { name, age } = args;
                let author = new AuthorModel({ name, age });
                return author.save();
            }
        },
        addCategory: {
            type: CategoryType,
            args: {
                slug: { type: GraphQLString },
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                const { name, slug } = args;
                let category = new CategoryModel({ name, slug });
                return category.save();
            }
        },
        addComment: {
            type: CommentType,
            args: {
                postId: { type: GraphQLID },
                authorId: { type: GraphQLID },
                email: { type: GraphQLString },
                website: { type: GraphQLString },
                comment: { type: GraphQLString },
            },
            resolve(parent, args) {
                const { postId, authorId, comment, email, website } = args;
                let create = new CommentModel({ postId, authorId, comment, email, website });
                return create.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});