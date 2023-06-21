const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    blogs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post2",
          },
    ]

   
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)