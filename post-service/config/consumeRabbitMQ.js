const rabbitmq = require('../config/rabbitMqConfig');
const PostSchema = require('../models/Post');

const channel = rabbitmq.connectRabbitMQ();

const consumeDataCreateComment = async () => {
    try {
        //for get userId and get that id then insert commentId ino post's comment array 
        (await channel).assertQueue("comment-post-create-comment");
        (await channel).consume("comment-post-create-comment", async (message) => {
            try {
                //stringyfy the content and check whether data is available or not
                const data = JSON.parse(message.content);
                console.log(data);
                console.log(data.postId);
                console.log(data.userId);
                console.log(data.commentId);

                // get post realated to that message postId
                const updatedPost = await PostSchema.findByIdAndUpdate(
                    data.postId,
                    { $push: { comments: data.commentId } },
                    { new: true }
                );

                console.log("Comment id added to the post's comment array and post updated", updatedPost);
                console.log(updatedPost);

                (await channel).ack(message);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

const consumeDataDeleteComment = async () => {
    try {
        (await channel).assertQueue("comment-post-delete-comment");
        (await channel).consume("comment-post-delete-comment", async (message) => {
            const data = JSON.parse(message.content);
            console.log(data);
            console.log(data.postId);
            console.log(data.commentId);

            const updatedPost = await PostSchema.findByIdAndUpdate(
                data.postId,
                { $pull: { comments: data.commentId } },
                { new: true }
            );

            console.log("Comment id removed from the post's comment array and post updated", updatedPost);
            console.log(updatedPost);
            (await channel).ack(message);
        });
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

module.exports = {
    consumeDataCreateComment,
    consumeDataDeleteComment
};