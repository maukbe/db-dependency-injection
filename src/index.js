var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const DataModel = require("./model/dataModel");

const data = {
  a: "b",
  b: "c",
};

const data2 = {
  a: "c",
  b: "d",
};

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "myproject";
const client = new MongoClient(url);
// Use connect method to connect to the server
client.connect(async function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const collection = db.collection("data");
  const dataModel = DataModel(collection);
  await dataModel.create(data);
  console.log("Data created");
  let m = await dataModel.retrieve();
  console.log(m);
  console.log("Adding new data");
  await dataModel.create(data2);
  console.log("Data created");
  console.log(await dataModel.retrieve());

  client.close();
});
