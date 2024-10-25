const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5500;

let client, database, contacts, profiles;  // Declare variables for collections

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URI
const uri = "mongodb://localhost:27017/?directConnection=true";

// Connect to MongoDB when server starts
async function connectDB() {
    try {
        client = new MongoClient(uri);
        await client.connect();
        database = client.db('jobs');  // Connect to the 'jobs' database
        contacts = database.collection('contacts');  // Connect to 'contacts' collection
        profiles = database.collection('profiles');  // Connect to 'profiles' collection
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

connectDB();  // Call the function to connect when the server starts

// Function to save contact form data
async function saveContact(data) {
    try {
        const result = await contacts.insertOne(data);  // Insert into the 'contacts' collection
        console.log(`Contact form inserted with _id: ${result.insertedId}`);
        return result;
    } catch (err) {
        console.error("Error saving contact:", err);
        throw err;
    }
}

// Function to save profile form data
async function saveProfile(data) {
    try {
        const result = await profiles.insertOne(data);  // Insert into the 'profiles' collection
        console.log(`Profile saved with _id: ${result.insertedId}`);
        return result;
    } catch (err) {
        console.error("Error saving profile:", err);
        throw err;
    }
}

// Handle POST request to save contact form data
app.post('/save-contact', async (req, res) => {
    const contactData = req.body;

    try {
        const result = await saveContact(contactData);
        res.json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Handle POST request to save profile form data
app.post('/save-profile', async (req, res) => {
    const profileData = req.body;

    try {
        const result = await saveProfile(profileData);
        res.json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
