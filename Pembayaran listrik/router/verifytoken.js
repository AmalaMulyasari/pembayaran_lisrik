const jwt = require('jsonwebtoken')

verifyToken = (req, res, next) => {
    // ambil token dari header
    let headers = req.headers.authorization
    let token = null
    
    if(headers != null){
        // ambil kode token 
        token = headers.split(" ")[1] // ambil bagian ke 1 array
    }

    if(token == null){
        res.json({
            message: "Unauthorized / tidak dikenali"
        })
    }else{
        // set jwt
        let jwtHeaders = {
            algorithm: "HS256"
        }
        let secretKey = "ukklistrik"
        // jwt verify token | secretKey | jwtHeader | err
        jwt.verify(token, secretKey, jwtHeaders, err => {
            if(err){
                res.json({
                    message: "Invalid or expired token"
                })
            }else{
                next()
            }
        }) 
    }
}

module.exports = verifyToken