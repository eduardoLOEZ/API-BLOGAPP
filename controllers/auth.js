require("dotenv").config()
const User = require("../models/User")
const Post2 = require("../models/Post2")
const bcrypt = require("bcrypt")
const { generateToken } = require("../helpers/generateToken")



const Register = async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      if (!(email && username && password)) {
        return res.status(400).send({ message: "Incomplete data provided" });
      }
  
      const emailExists = await User.findOne({ email });
  
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
  
      const newUser = await User.create({
        email,
        username,
        password: encryptedPassword,
      });
  
      res.status(201).json({ msg: "User created successfully", data: newUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };



  const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userFound = await User.findOne({ email });
  
      if (!userFound) {
        return res.status(400).json({ error: "Username or password are incorrect" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, userFound.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Username or password are incorrect" });
      }
  
      const token = generateToken({ user: userFound });
  
      return res.status(201).json({
        msg: "Inicio de sesión exitoso",
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };




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
    try {
      res.status(200).json({
        msg: "Cerró la sesión exitosamente",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Ocurrió un error al intentar cerrar la sesión",
      });
    }
  };



module.exports = {
    Register,
    Login,
    LogOut,
    viewProfile,
    UpdateProfile,
    
}