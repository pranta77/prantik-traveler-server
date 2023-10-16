const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// user:prantikTraveller
// pass:ipYmvMzys5phyJmu

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slr2lcz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("prantikTraveller");
    const usersCollection = database.collection("users");

    // GET API
    // get data from Database
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // POST API
    // Post/ Include Data To a Database
    app.post("/users", async (req, res) => {
      const uesr = req.body;
      console.log("Hit the post on site", uesr);
      const result = await usersCollection.insertOne(uesr);
      console.log(result);
      res.json("post hit");
    });

    // Load Only one/single Data in The Database
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("Getting Specific service", id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      // console.log(result);
      res.json(result);
    });

    // Delete data to database and client side
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Prantik server");
});

app.listen(port, () => {
  console.log("server Running on port", port);
});
