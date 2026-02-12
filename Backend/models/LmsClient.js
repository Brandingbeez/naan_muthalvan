const mongoose = require("mongoose");

const lmsClientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        client_key: { type: String, required: true, unique: true },
        client_secret: { type: String, required: true }, // Will be stored as hash
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LmsClient", lmsClientSchema);
