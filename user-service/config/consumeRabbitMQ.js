const rabbitmq = require('../config/rabbitMqConfig');
const UserSchema = require('../models/User');

const channel = rabbitmq.connectRabbitMQ();

const consumeDataCreatePost = async () => {
    try {
        //for get userId and get that id then insert postId ino posts array 
        (await channel).assertQueue("post-user-create-post");
        (await channel).consume("post-user-create-post", async (message) => {
            try {
                //stringyfy the content and check whether data is available or not
                const data = JSON.parse(message.content);
                console.log(data);
                console.log(data.postId);
                console.log(data.userId);

                // get user realated to that message userId
                const updatedUser = await UserSchema.findByIdAndUpdate(
                    data.userId,
                    { $push: { posts: data.postId } },
                    { new: true }
                );

                console.log(updatedUser);

                (await channel).ack(message);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

const consumeDataDeletePost = async () => {
    try {
        //for get userId and get that id then insert postId ino posts array 
        (await channel).assertQueue("post-user-delete-post");
        (await channel).consume("post-user-delete-post", async (message) => {
            try {
                //stringyfy the content and check whether data is available or not
                const data = JSON.parse(message.content);
                console.log(data);
                console.log(data.postId);
                console.log(data.userId);

                // get user realated to that message userId and delete the post in posts array
                await UserSchema.findByIdAndUpdate(
                    data.userId,
                    { $pull: { posts: data.postId } },
                    { new : true }
                );

                console.log("Post removed from posts array");

                (await channel).ack(message);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

module.exports = {
    consumeDataCreatePost,
    consumeDataDeletePost
};