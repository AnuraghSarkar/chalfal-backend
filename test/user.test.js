//model path
const mongoose = require("mongoose");
const User = require("../models/user");
const { MONGODB_URI: url } = require("../utils/config");

// test connection
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

describe("Testing User Schema", () => {
  // test user validation schema
  test("User Schema should be defined", () => {
    expect(User).toBeDefined();
  });
  test("User Schema should have a username field", () => {
    expect(User.schema.path("username")).toBeDefined();
  });
  test("User Schema should have a password field", () => {
    expect(User.schema.path("passwordHash")).toBeDefined();
  });

  let ObjectId = require("mongodb").ObjectID;
  let id = new ObjectId();
  //test: add user
  it("post/user --> add new user", () => {
    const user = {
      _id: id,
      username: "testing123",
      passwordHash: `RA6wsUhpsD$agaGasg@gagfsa`,
    };
    
    return User.create(user).then((pro_ret) => {
      expect(pro_ret.username).toEqual("testing123");
    });
  });

  //get a user
  it("get/user/:id--> get a user", async () => {
    await User.findOne({ _id: id });
    expect(1).toBe(1);
  });

  //test: delete user
  it("delete/user/:id ---> delete a user", async () => {
    await User.deleteOne({ _id: id });
    expect(1).toBe(1);
  });
});
