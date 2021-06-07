const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const temperatures = new Schema(
    {
        temperature: { type: Number },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('temperatures', temperatures);