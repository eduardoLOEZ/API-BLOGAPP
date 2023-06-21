require("dotenv").config()
const jwt = require("jsonwebtoken")

const generateToken = (id, username)=>{

    try {
        
        const token = jwt.sign({id: id, uername: username}, process.env.SECRET , {expiresIn:60*60})
        return token

    } catch (error) {
        console.log(error)
    }

}

module.exports= {generateToken}