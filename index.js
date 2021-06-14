const express = require("express")
const mongoose = require("mongoose")
const routes = require("./route")



mongoose
    .connect("mongodb://localhost:27017/uts_si4b", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const app = express()
        app.use(express.json())
        app.use("/", routes)
        app.use('/image', express.static(__dirname + '/view/img'))
        app.use('/css', express.static(__dirname + '/view/css'))
        app.use('/js', express.static(__dirname + '/view/js'))
        const port = process.env.port || 5000
        app.listen(port, () => {
            console.log(`Server has started on port ${port}`)
        })
    })