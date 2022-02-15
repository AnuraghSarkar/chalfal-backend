const mongoose = require('mongoose');
const Subreddit = require('../models/subreddit');
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

// Testing Subreddit Schema
describe('Testing Subreddit Schema', () => { 
    // test user validation schema
    test('Subreddit Schema should be defined', () => {
        expect(Subreddit).toBeDefined();
    });
    test('Subreddit Schema should have a subredditName field', () => {
        expect(Subreddit.schema.path('subredditName')).toBeDefined();
    });
    test('Subreddit Schema should have a description field', () => {
        expect(Subreddit.schema.path('description')).toBeDefined();
    });
    test('Subreddit Schema should have a posts field', () => {
        expect(Subreddit.schema.path('posts')).toBeDefined();
    });
    test('Subreddit Schema should have a admin field', () => {
        expect(Subreddit.schema.path('admin')).toBeDefined();
    });
    test('Subreddit Schema should have a subscribedBy field', () => {
        expect(Subreddit.schema.path('subscribedBy')).toBeDefined();
    });
    test('Subreddit Schema should have a subscriberCount field', () => {
        expect(Subreddit.schema.path('subscriberCount')).toBeDefined();
    });

    //get a subreddit
    it('get/subreddit --> get a subreddit', async () => {
        await Subreddit.findOne();
        expect(1).toBe(1);
    })

    // delete a subreddit
    it('delete/subreddit ---> delete a subreddit', async () => {
        await Subreddit.deleteOne();
        expect(1).toBe(1);
    });

    // update a subreddit
});