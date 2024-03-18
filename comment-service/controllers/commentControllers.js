const CommentSchema = require('../models/Comment');
const rabbitmq = require('../config/rabbitMqConfig');

const channel = rabbitmq.connectRabbitMQ();

const getAllComments = async (req, res) => {
    try {
        const comments = await CommentSchema.find();
        return res.status(200).json({
            statusCode: 200,
            message: "Get all comments query was successfully",
            data: comments
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Get all comments query internal server error",
            error: error.message
        });
    }
}
const getComment = async (req, res) => {
    try {
        const comment = await CommentSchema.findById(req.params.commentId);
        if(!comment) {
            return res.status(404).json({
                statusCode: 404,
                message: "Get comment query was failed",
                data: `${req.params.commentId} comment id not found`
            });
        }else {
            return res.status(200).json({
                statusCode: 200,
                message: "Get comment query was successfully",
                data: comment
            });
        }
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Get comment query internal server error",
            error: error.message
        });
    }
}
const updateComment = async (req, res) => {
    try {
        const updatedComment = await CommentSchema.findByIdAndUpdate(
            req.params.commentId,
            { $set: req,body },
            { new: true }
        );
        return res.status(201).json({
            statusCode: 201,
            message: "Update comment query was successfully",
            data: updatedComment
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Update comment query internal server error",
            error: error.message
        });
    }
}
const createComment = async (req, res) => {
    try {
        const { comment, userId, postId } = req.body;

        const newComment = new CommentSchema({
            comment: comment,
            postId: postId,
            userId: userId,
        });

        const savedComment = await newComment.save();

        //create message object
        const message = {
            postId: postId, 
            userId: userId, 
            commentId: savedComment._id
        };

        (await channel).assertQueue('comment-post-create-comment');
        (await channel).sendToQueue('comment-post-create-comment', Buffer.from(JSON.stringify(message)));

        console.log('Comment, User and Posts IDs sent to the post service', message);

        return res.status(201).json({
            statusCode: 201,
            message: "Create comment query was successful",
            data: savedComment
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Delete comment query internal server error",
            error: error.message
        });
    }
}
const deleteComment = async (req, res) => {
    try {
        await CommentSchema.findByIdAndDelete(req.params.commentId);

        //send commentId to the rabbitmq server
        const message = {
            postId: req.body.postId,
            commentId: req.params.commentId
        };

        (await channel).assertQueue("comment-post-delete-comment");
        (await channel).sendToQueue("comment-post-delete-comment", Buffer.from(JSON.stringify(message)));

        console.log("Post and comment IDs sent successfully to comment-post-delete-comment queue for remove commentId from posts's comments array", message);

        return res.status(204).json({
            statusCode: 204,
            message: "Delete comment query was successfully",
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Delete comment query internal server error",
            error: error.message
        });
    }
}

module.exports = {
    getAllComments,
    getComment,
    updateComment,
    deleteComment,
    createComment
};