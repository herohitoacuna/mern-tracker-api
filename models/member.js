const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memberSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Member', memberSchema)