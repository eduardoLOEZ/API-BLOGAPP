require("dotenv").config()
const jwt = require("jsonwebtoken")

const generateToken = (user)=>{

    try {
        
        const token = jwt.sign(user, process.env.SECRET , {expiresIn:"10m" })
        return token

    } catch (error) {
        console.log(error)
    }

}

module.exports= {generateToken}