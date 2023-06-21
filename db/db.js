require("dotenv").config()
const mongoose  = require("mongoose")


const dbConect =() =>{
    try {
        mongoose.connect(process.env.DB)
        .then(()=>{console.log("conectado a la db!")})
        .catch(()=>{console.log("error al conectar la db")})

    } catch (error) {
        console.log(error)
    }
}

module.exports= {dbConect}