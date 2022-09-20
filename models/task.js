const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    description: String,
    teamId: String,
    isCompleted: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)