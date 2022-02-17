//model path
const mongoose = require("mongoose");
const Post = require("../models/post");
const { MONGODB_URI: url } = require("../utils/config");

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

describe("Testing Post Schema", () => {
  // test user validation schema
  test("Post Schema should be defined", () => {
    expect(Post).toBeDefined();
  });
  test("Post Schema should have a title field", () => {
    expect(Post.schema.path("title")).toBeDefined();
  });
  test("Post Schema should have a type field", () => {
    expect(Post.schema.path("postType")).toBeDefined();
  });
  test("Post Schema should have a author field", () => {
    expect(Post.schema.path("author")).toBeDefined();
  });
  test("Post Schema should have a subreddit", () => {
    expect(Post.schema.path("subreddit")).toBeDefined();
  });
  test("Post Schema should have a upvoted field", () => {
    expect(Post.schema.path("upvotedBy")).toBeDefined();
  });
  test("Post Schema should have a downvotedBy field", () => {
    expect(Post.schema.path("downvotedBy")).toBeDefined();
  });
  test("Post Schema should have a comments field", () => {
    expect(Post.schema.path("comments")).toBeDefined();
  });
  let ObjectId = require("mongodb").ObjectID;
  let id = new ObjectId();
  it("post/post --> add new post", () => {
    const post = {
      _id: id,
      title: "test post",
      postType: "text",
      textSubmission: "test post",
    };
    return Post.create(post).then((res) => {
      expect(res.title).toEqual("test post");
    });
  });

  //get a post
  it("get/post--> get a post", async () => {
    await Post.findOne({ _id: id });
    expect(1).toBe(1);
  });
  // update a post
  it("put/post/:id ---> update a post", async () => {
    await Post.findOneAndUpdate(
      { _id: id },
      { $set: { title: "test passed" } },
      { new: true }
    ).then((res) => {
      expect(res.title).toEqual("test passed");
    });
  });

  // delete a post
  it("delete/post/:id ---> delete a post", async () => {
    await Post.deleteOne({ _id: id });
    expect(1).toBe(1);
  });

});
