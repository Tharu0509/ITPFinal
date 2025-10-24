const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            default: "Main Villa",
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        image: {
            type: String, // will store image filename (uploads/myimage.jpg)
            default: "default.jpg"
        }
    },
    { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Activity", actSchema);

