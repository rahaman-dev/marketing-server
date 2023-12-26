const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri =
  "mongodb+srv://markating:RuERoXNRsUnbSfjc@cluster0.bk91ias.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dataCollection = client.db("markating").collection("restoData");

// Define the route outside of the run function
app.post("/post-resto-data", async (req, res) => {
  try {
    const { name, map, website, facebook, instagram, phone, email } = req.body;

    const data = {
      name,
      map,
      website,
      facebook,
      instagram,
      phone,
      email,
    };

    const result = await dataCollection.insertOne(data);
    console.log(`Data saved to MongoDB with ID: ${result.insertedId}`);
    res.json({ message: "Data saved to MongoDB", data });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-resto-data", async (req, res) => {
  try {
    const result = await dataCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function startServer() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

startServer().catch(console.dir);
