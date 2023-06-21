const mongoose = require("mongoose");

const postSchema2 = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  imgurl: String,
  cloudinaryId: {
    type: String,
  }, 
  // Campo para almacenar el nombre del archivo adjunto
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: {
    type: Date,
    
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      name: {
        type: String,
      },
      comment: {
        type: String,
      },
      date: {
        type: Date,
      }
    }
  ]
});





const Post = mongoose.model("Post2", postSchema2);

module.exports = Post;
