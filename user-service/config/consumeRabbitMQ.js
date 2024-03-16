const rabbitmq = require('../config/rabbitMqConfig');
const UserSchema = require('../models/User');

const channel = rabbitmq.connectRabbitMQ();

const consumeData = async () => {
    try {
        //for get userId and get that id then insert postId ino posts array 
        (await channel).assertQueue("post-user");
        (await channel).consume("post-user", async (message) => {
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

module.exports = {
    consumeData
};