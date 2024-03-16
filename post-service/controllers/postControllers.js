const PostSchema = require('../models/Post');
const rabbitmq = require('../config/rabbitMqConfig');

const channel = rabbitmq.connectRabbitMQ();

const getAllPosts = async (req, res) => {
    try {
        const posts = await PostSchema.find();
        return res.status(200).json({
            statusCode: 200,
            message: "Get all posts query was successful",
            data: posts
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Get all posts internal server error",
            error: error.message
        });
    }
}
const getPost = async (req, res) => {
    try {
        const post = await PostSchema.findByIdAndUpdate(req.params.postId);
        return res.status(200).json({
            statusCode: 200,
            message: "Get post query was successful",
            data: post
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Get post internal server error",
            error: error.message
        });
    }
}
const deletePost = async (req, res) => {
    try {
        await PostSchema.findByIdAndDelete(req.params.postId);
        return res.status(204).json({
            statusCode: 204,
            message: "Delete post query was successful",
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Delete post internal server error",
            error: error.message
        });
    }
}
const createPost = async (req, res) => {
    try {
        const { title, description, user } = req.body;
        const newPost = new PostSchema({
            title: title,
            description: description,
            user: user
        });
        const savedPost = await newPost.save();

        // Prepare message content 
        const message = {
            postId: savedPost._id,
            userId: savedPost.user,
        };

        (await channel).assertQueue("post-user");
        (await channel).sendToQueue("post-user", Buffer.from(JSON.stringify(message)));

        console.log("Post and User IDs sent successfully to post-user queue", message);

        return res.status(200).json({
          statusCode: 200,
          message: "Create post query was successful",
          data: savedPost
        });
        
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Create post internal server error",
            error: error.message
        });
    }
}
const updatePost = async (req, res) => {
    try {
        const post = await PostSchema.findByIdAndUpdate(
            req.params.postId,
            { $set: req.body },
            { new: true }
        );
        return res.status(200).json({
            statusCode: 200,
            message: "Update post query was successful",
            data: post
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Update post internal server error",
            error: error.message
        });
    }
}

module.exports = {
    getAllPosts,
    getPost,
    deletePost,
    createPost,
    updatePost
}