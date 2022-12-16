const expressAsyncHandler = require("express-async-handler");
const connection = require("../db/init");
const Comment = require("../models/comment.model");

const createComment= expressAsyncHandler(async(req, res)=> {
    try {
        const comment= await Comment.create(req.body)
        return res.status(200).json(comment)
    } catch (error) {
        return res.status(404).json(error.message)
    }
})

const getAllComment= expressAsyncHandler(async(req, res)=> {
    try {
        const [rows]= await connection.execute("SELECT comments.content,comments.rate, users.username, comments.createdAt FROM comments INNER JOIN users ON users.id = comments.userId")
        return res.status(200).json(rows)
        
    } catch (error) {
        return res.status(404).json(error.message)
    }
})

module.exports= {
    createComment,
    getAllComment
}