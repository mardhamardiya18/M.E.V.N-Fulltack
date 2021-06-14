const mongoose = require("mongoose")
const schema = mongoose.Schema({
    kode: String,
    isi: String,
    gambar: String
})

module.exports = mongoose.model("Product", schema)