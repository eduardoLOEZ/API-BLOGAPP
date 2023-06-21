require("dotenv").config()
const User = require("../models/User")
const Post2 = require("../models/Post2")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../helpers/generateToken")



const Register = async (req, res) => {
    try {

        const { email, username, password } = req.body

        if (!(email && username && password)) {
            return res.status(400).send({ message: "no colocaste los datos de manera correcta o ninguno" })

        }

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }




        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = await bcrypt.hash(password, salt)

        const NewUser = await User.create({
            email,
            username,
            password: encryptedPassword
        })

        return res.json({ msg: "usuario creado!!", data: NewUser })

    } catch (error) {
        console.log(error)

    }
}



const Login = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'Username or password are incorrect',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                error: 'Username or password are incorrect',
            });
        }


        //generar token 
        const token = generateToken({
            id: user._id,
            email: user.email,
            username: user.username
        })

        res.cookie('token', token).json({
            msg: `inicio de seion correcto. Bienvenido ${user.username}`,
            id: user.id,
            username: user.username

        })




        //return res.status(201).json({msg: "inicio de sesion correcta", token, username:user.username})


    } catch (error) {
        console.log(error)

    }

}

const Data = async (req, res) => {
    const { token } = req.body

    try {
        jwt.verify(token, process.env.SECRET, async (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: "Token de autenticación inválido" });
            }

            const user = User.findById(decoded.id.id)
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            return res
                .status(200)
                .send({ id: user._id, name: user.name, email: user.email });
        })



    } catch (error) {
        return res.status(401).send({ error: "Invalid token" });

    }

}



const viewProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const blogs = await Post2.find({ author: user.id })
        const likedBlogs = await Post2.find({ likes: req.user.id })

        return res.status(200).json({
            id: user.id,
            name: user.username,
            email: user.email,
            blogs: blogs,
            likedBlogs: likedBlogs
        })



    } catch (error) {
        console.log(error)

    }

}


const UpdateProfile = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        if (!username && !password) {
            return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
        }

        if (username) {
            user.username = username;
        }

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            user.password = encryptedPassword;
        }

        await user.save();

        return res.status(200).json({ msg: "Perfil actualizado correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};



//Cerrar la sesion
const LogOut = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
}

const VerifyToken = async (req,res) =>{
    const { token } = req.cookies

    if(!token) return res.status(401).json({msg: "No autorizado"})

    jwt.verify(token, process.env.SECRET, (err, user) =>{
        if(err) return res.status(401).json({msg:"no autorizado" })

        const userFound = User.findById(user.id)

        if(!userFound) return res.status(401).json({msg: "no autorizado"})

        return res.json({
            id: userFound.id,
            username: userFound.username,
            email: userFound.email,

        })
    })

}

module.exports = {
    Register,
    Login,
    LogOut,
    viewProfile,
    UpdateProfile,
    Data,
    VerifyToken
}