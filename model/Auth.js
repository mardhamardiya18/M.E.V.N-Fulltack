const mongoose = require("mongoose")

const schema = mongoose.Schema({
    username: String,
    pass: String,
})

module.exports = mongoose.model("Auth", schema)