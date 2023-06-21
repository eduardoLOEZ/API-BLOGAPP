require("dotenv").config()
const Post2 = require("../models/Post2")
const jwt = require("jsonwebtoken")
const cloudinary = require("./cloudinary");

const CreateBlog = async (req, res) => {
  try {
    //obtiene el token de las cookies para que al crear el blog tenga datos como el author
    //se puede usar como midd
    //capturar el body
    const { title, summary, content } = req.body;
    //let coverImage = null;

    //el file que es la img 
    if (!req.file) {
      res.status(404).json({ msg: "no hay imagen" })
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",

    });
    let imgurl = result.secure_url;
    const cloudinaryId = result.public_id;

    //crear el nuevo post
    const newPost = new Post2({
      title,
      summary,
      content,
      imgurl,
      cloudinaryId,
      author: req.user.id,
      username: req.user.username
    });



    await newPost.save();

    return res.json({
      msg: "Blog creado correctamente",
      data: newPost,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};


const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, summary, content } = req.body;
    const updatedFields = { title, summary, content };

    const post = await Post2.findById(id);

    if (!post) {
      return res.status(404).json({ error: "No se encontró el post" });
    }

    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ msg: "No tienes permiso para editar este post" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      updatedFields.coverImage = result.secure_url;
      updatedFields.cloudinaryId = result.public_id;
    }

    Object.assign(post, updatedFields);

    await post.save();

    return res.json({
      msg: "Blog actualizado correctamente",
      data: post,
    });


  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};







const GetAllBlogs = async (req, res) => {
  try {
    const blogs = await Post2.find({});
    return res.status(200).json({ blogs: blogs });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

  }
}


const getBlogById = async (req, res) => {
  const { id } = req.params;
  const blog = await Post2.findById(id).populate('author', ['username']);

  if (!blog) {
    res.json({ msg: "blog no encontrado" })
  }

  return res.status(200).json({ blog: blog });

}


const LikePost = async (req, res) => {
  try {
    const { id } = req.params

    const user = req.user.id;
    const post = await Post2.findById(id)

    if (!post) {
      return res.status(400).json({ error: "No se encontro este blog" })
    }

    if (post.likes.includes(user)) {
      return res.status(400).json({ error: "Ya has dado like a este post" });
    }

    post.likes.push(user)
    await post.save()

    return res.json({
      msg: "Has dado like al post",
      blog: post
    });





  } catch (error) {
    console.log(error)

  }

}

const UnlikePost = async (req, res) => {
  const { id } = req.params;


  const user = req.user.id;

  const post = await Post2.findById(id);

  if (!post) {
    return res.status(404).json({ error: "No se encontró el post" });
  }

  const index = post.likes.indexOf(user)
  if (index === -1) {
    return res.status(400).json({ error: "Aún no has dado like a este post" });
  }

  post.likes.splice(index, 1);
  await post.save();

  return res.json({
    msg: "Has quitado el like del post",
    blog: post
  });




}

const addComment = async (req, res) => {
  const { id } = req.params
  const { comment } = req.body


  const post = await Post2.findById(id);
  const user = req.user.id

  if (!post) {
    return res.status(400).json({ msg: "No se encontro el blog" })
  }


  post.comments.push({
    name: user.username,
    comment: comment,
    date: new Date()
  });
  await post.save()

  return res.json({
    msg: "comentario creado!"
  })





}



const deleteBlog = async (req, res) => {
  try {

    const { id } = req.params;

    const post = await Post2.findById(id)


    if (!post) {
      return res.status(404).json({ error: "No se encontró el post" });
    }

    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ msg: "no tienes permiso para eliminar este post!" })
    }

    await post.deleteOne({ _id: id });
    return res.json({
      msg: "Blog eliminado correctamnete"
    })






  } catch (error) {
    console.log(error)

  }

}




module.exports = { CreateBlog, GetAllBlogs, getBlogById, deleteBlog, LikePost, UnlikePost, addComment, updateBlog }