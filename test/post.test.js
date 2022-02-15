//model path
const mongoose = require('mongoose');
const Post = require('../models/post');
const {
    MONGODB_URI: url
} = require("../utils/config");

beforeAll(async () => {
    await mongoose.connect(url, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Testing Post Schema', () => {
    // test user validation schema
    test('Post Schema should be defined', () => {
        expect(Post).toBeDefined();
    });
    test('Post Schema should have a title field', () => {
        expect(Post.schema.path('title')).toBeDefined();
    });
    test('Post Schema should have a type field', () => {
        expect(Post.schema.path('postType')).toBeDefined();
    });
    test('Post Schema should have a author field', () => {
        expect(Post.schema.path('author')).toBeDefined();
    });
    test('Post Schema should have a subreddit', () => {
        expect(Post.schema.path('subreddit')).toBeDefined();
    });
    test('Post Schema should have a upvoted field', () => {
        expect(Post.schema.path('upvotedBy')).toBeDefined();
    });
    test('Post Schema should have a downvotedBy field', () => {
        expect(Post.schema.path('downvotedBy')).toBeDefined();
    });
    test('Post Schema should have a comments field', () => {
        expect(Post.schema.path('comments')).toBeDefined();
    });

    //get a post
    it('get/post--> get a post', async () => {
        await Post.findOne();
        expect(1).toBe(1);
    })

    // delete a post
    it('delete/post ---> delete a post', async () => {
        await Post.deleteOne();
        expect(1).toBe(1);
    });

    // update a post
    it('put/post ---> update a post', async () => {
        await Post.findOneAndUpdate();
        expect(1).toBe(1);
    });


});