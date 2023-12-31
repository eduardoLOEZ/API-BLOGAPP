require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//middleware para validar token y auth para que cada uno de los usuarios/admin
//puedan realizar las tareas del CRM siempre y cuando hayan iniciado sesión
const auth = (req, res, next) => {
  try {
    const { token } = req.headers;

    jwt.verify(token, process.env.SECRET, (error, user) => {
      if (error) {
        return res
          .status(401)
          .json({ message: "Token is not valid, please Login" });
      }
      req.user = {
        id: new mongoose.Types.ObjectId(user.id),
        //usar el id del usuario que genero el token
      };
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { auth };