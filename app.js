const express  = require("express")
const cors  = require("cors")
const cookieParser  = require("cookie-parser")
const router = require("./routes/auth")
const blogRouter = require("./routes/blogs")
const { errorHandler } = require("./middlewares/ErrorHandler")
const morgan = require("morgan")
const app = express()


//configuraciones 
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use("/public", express.static(`${__dirname}/uploads`))
app.use(morgan("dev"))
app.use(errorHandler)

//Rutas 
app.use(router)
app.use(blogRouter)




app.get("/",  (req,res) =>{
    res.send({
        msg:"API",
        version: "1.0.0",
        author: "eduardo "
    })
})


module.exports={app}


