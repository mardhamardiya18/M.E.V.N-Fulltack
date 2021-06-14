const mongoose = require("mongoose")
const schema = mongoose.Schema({
    judul: String,
    isi: String,
    gambar: String
})

module.exports = mongoose.model("Event", schema)