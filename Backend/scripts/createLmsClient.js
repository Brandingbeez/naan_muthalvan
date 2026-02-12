const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const LmsClient = require("../models/LmsClient");
const { connectDB } = require("../config/db");

dotenv.config({ path: path.join(__dirname, "../.env") });

const createClient = async () => {
    await connectDB();

    const name = "Test Client";
    const client_key = "test_key_" + Math.random().toString(36).substring(7);
    const raw_secret = "test_secret";

    const client_secret = await bcrypt.hash(raw_secret, 10);

    try {
        const client = await LmsClient.create({
            name,
            client_key,
            client_secret: client_secret
        });

        console.log("Client Created Successfully");
        console.log("---------------------------");
        console.log("Client Key:", client_key);
        console.log("Client Secret:", raw_secret);
        console.log("---------------------------");
    } catch (err) {
        console.error("Error creating client:", err);
    } finally {
        mongoose.disconnect();
    }
};

createClient();
