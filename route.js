const express = require("express")
const Event = require("./model/Event")
const product = require("./model/Product")
const Auth = require("./model/Auth")
const router = express.Router()
var path = require('path')
const jwt = require('jsonwebtoken')


module.exports = router


// function untuk mengecek token
function isAuthenticated(req, res, next) {
    var token = req.header('auth-token') || req.params.id; // mengambil token di antara request
    if (token) { //jika ada token
        jwt.verify(token, 'jwtsecret', function (err, decoded) { //jwt melakukan verify
            if (err) { // apa bila ada error
                res.json({ message: 'Failed to authenticate token' }); // jwt melakukan respon
            } else { // apa bila tidak error
                req.decoded = decoded; // menyimpan decoded ke req.decoded
                next(); //melajutkan proses
            }
        });
    } else { // apa bila tidak ada token
        return res.status(403).send({ message: 'No token provided.' }); // melkukan respon kalau token tidak ada
    }
}







router.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'))
})

router.get("/admin/", async (req, res) => {

    res.sendFile(path.join(__dirname + '/view/admin.html'));


})

router.get("/login", async (req, res) => {

    res.sendFile(path.join(__dirname + '/view/login.html'));


})

// authentication Login
router.post("/login_auth", async (req, res) => {



    //	select * from namatabel where username="" and password=""
    // if email exist
    const user = await Auth.findOne({ username: req.body.username, pass: req.body.pass })
    if (!user) return res.status(400).json({
        status: res.statusCode,
        message: 'Gagal Login!'
    })
    else

        var token = jwt.sign({ username: req.body.username }, 'jwtsecret', { algorithm: 'HS256', expiresIn: '10s' });

    //res.json({message:'berhasil login', token: token});

    return res.status(200).json({


        token: token,
        username: req.body.username,
        status: res.statusCode,
        message: 'Sukses Login!'
    })
})

// function cek halaman
router.post("/cek_page", async (req, res) => {
    var old_token = req.body.old_token;
    jwt.verify(old_token, 'jwtsecret', function (err, decoded) {
        if (err) {
            res.json({ message: 'Halaman tidak diijinkan diakses' })
        } else {
            return res.status(200).json({
                message: 'ok'
            })
        }
    })
})

// func refersh token
router.post("/refresh_token", async (req, res) => {
    var last_username = req.body.username;
    var last_token = req.body.token;

    jwt.verify(last_token, 'jwtsecret', function (err, decoded) {
        if (err) {
            res.json({ message: 'Failed to Authenticate token' });
        } else {
            req.decoded = decoded;
            var token = jwt.sign({ last_username }, 'jwtsecret', { algorithm: 'HS256', expiresIn: '10s' });

            return res.status(200).json({
                token: token,
                status: res.statusCode,
                message: 'Token Baru!'
            })
        }
    })
})

// Router event

// get All
router.get("/getevent", async (req, res) => {
    const getevent = await Event.find()
    res.send(getevent)
})



// post data
router.post("/getevent", async (req, res) => {
    const getevent = new Event({
        judul: req.body.judul,
        isi: req.body.isi,
        gambar: req.body.gambar
    })
    await getevent.save()
    res.send(getevent)
})

//Router product

// get data
router.get("/getproduct", async (req, res) => {
    const getproduct = await product.find()
    res.send(getproduct)
})

// post data
router.post("/getproduct", async (req, res) => {
    const getproduct = new product({
        kode: req.body.kode,
        isi: req.body.isi,
        gambar: req.body.gambar
    })
    await getproduct.save()
    res.send(getproduct)
})

//  update data
router.patch("/updateproduct/:id", async (req, res) => {
    try {
        const ambilproduct = await product.findOne({ _id: req.params.id })

        if (req.body.kode) {
            ambilproduct.kode = req.body.kode
        }

        if (req.body.isi) {
            ambilproduct.isi = req.body.isi
        }
        if (req.body.gambar) {
            ambilproduct.gambar = req.body.gambar
        }

        await ambilproduct.save()
        res.send(ambilproduct)
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})

// delete  data
router.delete("/deleteproduct/:id", async (req, res) => {
    try {
        await product.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})
