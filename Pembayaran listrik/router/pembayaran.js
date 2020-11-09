const { urlencoded } = require('express')
const express = require('express')
const app = express()
// date
let date = new Date()
// call model
const pembayaran = require('../models/index').pembayaran
const tagihan = require('../models/index').tagihan
// middleware req body 
app.use(express.urlencoded({ extended:true }))
// call library multer
const multer = require("multer")
//  untuk membaca data request dari form-data
const path = require("path")
// untuk mengatur direktori file
const fs = require("fs")
const { error } = require('console')
// untuk mengatur file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/bukti")
    },
    filename: (req, file, cb) => {
        cb(null, "bukti-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})


// auth
const verifytoken = require('./verifytoken')
app.use(verifytoken)

app.get('/', async (req, res) => {
    pembayaran.findAll({
        include:[{ all: true, nested: true }]
    }) // get data
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})
app.post('/', upload.single('bukti'), async (req, res) => {
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: date,
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: req.body.status,
        bukti: req.file.filename,
        id_admin: req.body.id_admin
    }
    // change status tagihan to true
    let idTagihan = { id_tagihan: data.id_tagihan }
    let status = { status: 1 }
    tagihan.update(status, { where: idTagihan })

    pembayaran.create(data)
    .then(result => {
        res.json({
            message: 'Data inserted',
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put('/', upload.single('bukti'), async (req, res) => {
    let param = { id_pembayaran: req.body.id_pembayaran }
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: date,
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: req.body.status,
        id_admin: req.body.id_admin
    }

    if(req.file){
        let oldPembayaran = await pembayaran.findOne({ where: param })
        let oldBukti = oldPembayaran.bukti

        // delete oldBukti
        let pathFile = path.join(__dirname, "../assets/bukti", oldBukti)
        fs.unlink(pathFile, error => console.log(error))

        data.bukti = req.file.filename // masukin data baru
    }
    
    pembayaran.update(data,{where:param})
    .then(result => {
        res.json({
            message: 'Data Updated',
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete('/:id_pembayaran', async (req, res) => {
    let param = { id_pembayaran: req.params.id_pembayaran }

    let oldPembayaran = await pembayaran.findOne({ where: param })
    let oldBukti = oldPembayaran.bukti

    // delete oldCover
    let pathFile = path.join(__dirname, "../assets/bukti", oldBukti)
    fs.unlink(pathFile, error => console.log(error))

    pembayaran.destroy({where:param})
    .then(result => {
        res.json({
            message: 'Data Destroyed',
            data: result
        })
    })
    .cathc(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app