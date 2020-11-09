const express = require('express')
const app = express()

let pelanggan = require('./router/pelanggan')
let penggunaan = require('./router/penggunaan')
let tagihan = require('./router/tagihan')
let pembayaran = require('./router/pembayaran')
let admin = require('./router/admin')
let level = require('./router/level')
let tarif = require('./router/tarif')
let auth = require('./router/Auth')
let verifyPembayaran = require('./router/verifypembayaran')

app.use('/pelanggan', pelanggan)
app.use('/penggunaan', penggunaan)
app.use('/tagihan', tagihan)
app.use('/pembayaran', pembayaran)
app.use('/admin', admin)
app.use('/level', level)
app.use('/tarif', tarif)
app.use('/auth', auth)
app.use('/verifypembayaran', verifyPembayaran)

app.listen(8000, () => {
    console.log("Run on port 8000");
})