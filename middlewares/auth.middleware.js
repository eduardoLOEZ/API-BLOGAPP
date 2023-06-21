require("dotenv").config()
const jwt = require("jsonwebtoken")
const mongoose  = require("mongoose")

//middleware para validar token y auth
const auth = (req, res, next) => {
    try {
        const { token } = req.cookies

        jwt.verify(token, process.env.SECRET, (error, user) => {
            if (error) {
                return res.status(401).json({ message: "Token is not valid, please Login" });
            }
            req.user ={
                id: new mongoose.Types.ObjectId(user.id)
            }
            next()
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { auth }