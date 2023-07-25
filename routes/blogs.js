const express = require("express")
const blogRouter = express.Router()
const { CreateBlog } = require("../controllers/CreateBlog")
const { GetAllBlogs } = require("../controllers/CreateBlog")
const upload = require("../middlewares/storage")
const { getBlogById } = require("../controllers/CreateBlog")
const  { deleteBlog } = require("../controllers/CreateBlog")
const { LikePost } = require("../controllers/CreateBlog")
const { UnlikePost } = require("../controllers/CreateBlog")
const { addComment } = require("../controllers/CreateBlog")
const { updateBlog } = require("../controllers/CreateBlog")

const { auth } = require("../middlewares/auth.middleware")

//Crear blogs con imagenes usando midd de multer 
blogRouter.post("/createBlog",upload.single("imagen"), auth ,CreateBlog)
blogRouter.get("/blogs",GetAllBlogs)
blogRouter.get("/blog/:id" ,getBlogById)
blogRouter.delete("/delete/:id", auth ,deleteBlog)
blogRouter.post("/post/like/:id", auth ,LikePost)
blogRouter.post("/post/unlike/:id", auth ,UnlikePost)
blogRouter.post("/post/comment/:id", auth ,addComment)
blogRouter.put("/updateBlog/:id",upload.single("imagen"), auth ,updateBlog) //midd demulter para actualizar la imagen

module.exports=  blogRouter
