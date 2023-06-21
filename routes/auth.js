require("dotenv").config()
const express = require("express")
const router = express.Router()
const { Register } = require("../controllers/auth")
const { Login } = require("../controllers/auth")
//const { authMiddleware } = require("../middlewares/validateToken")
const { LogOut } = require("../controllers/auth")
const { viewProfile } = require("../controllers/auth")
const { UpdateProfile } = require("../controllers/auth")
const { Data } = require("../controllers/auth")
const  {  registerSchema, LoginSchema } = require("../schemas/auth.schema")
const { validateSchema } = require("../middlewares/validator.middleware")
const { auth } = require("../middlewares/auth.middleware")
const {VerifyToken} = require("../controllers/auth")

//endpoints
router.post("/sign-up", validateSchema(registerSchema) ,Register)
router.post("/login", validateSchema(LoginSchema) , Login)

//ver perfil        midd  para la cookie
router.get('/profile', auth ,viewProfile)
router.put("/updateProfile", auth , UpdateProfile)
router.post("/api/data", auth ,Data) //IGNORAR: EN PROCESO DE CAMBIO

//endpoint para usar en el front y verificar la cookie
router.get("/verify",VerifyToken )


//al hacer un logout se cierra la sesion con las cookies y al hacer otro GET al /profile 
//dara error ya que se cerro esa sesion y debe loguearse un usuario para generar otro token automatico.
router.post('/logout', LogOut)


module.exports = router
