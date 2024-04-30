const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fixku9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const craftCollection = client.db('craftDB').collection('craft')
        const userCollection = client.db('craftDB').collection('user');

       // part-1 for craft section part
        app.get('/craft', async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        
        // part-2
        app.post('/craft', async (req, res) => {
            const newArt = req.body;
            console.log(newArt);
            const result = await craftCollection.insertOne(newArt);
            res.send(result);
        })

        // part -3 find one added
        app.get('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result);
        })

        // part -4 for my craft
        app.get('/my-craft/:id', async (req, res) => {
            const result = await craftCollection.find({ email: req.params.id }).toArray();
            res.send(result);
        })

        // user related apis
        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Art craft server is running')
})

app.listen(port, () => {
    console.log(`Art Craft server is running on port: ${port}`)
})