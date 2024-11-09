const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

const uri = "mongodb+srv://zeyucai:1234567890@mldatabase.36zie.mongodb.net/?retryWrites=true&w=majority&appName=MLDatabase";
const client = new MongoClient(uri);
const dbName = "MLHorizon";
const dcName = "MLUserDataStorage";
let collection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db(dbName); // Set your database name
        collection = db.collection(dcName); //Set your Collection
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}

//Connect to database
connectToDatabase(); 

// Endpoint to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await collection.find({}).toArray();
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Endpoint to add a new user
app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    // Generate a unique ID for the new user
    const uniqueId = newUser.USERID;
    console.log("UNIQUE ID: " + uniqueId);

    try {
        const existingUser = await collection.findOne({ USERID: uniqueId });
        if (!existingUser) {
            newUser.chatBotConversations = [];
            newUser.canvasConversations = [];
            await collection.insertOne(newUser); // Add new user
            return res.status(201).json({ message: 'User added successfully!' });
        } else {
            await collection.updateOne(
                { USERID: uniqueId },
                { $set: { chatBotConversations: newUser.chatBotConversations } }
            );
            return res.json({ message: 'User updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log("\nClosing MongoDB connection...");
    await closeConnection();
    console.log("MongoDB connection closed. Server shutting down.");
    process.exit(0);
});
