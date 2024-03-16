const amqplib = require('amqplib');

const rabbitmqConfig = {
  hostname: 'localhost', 
  port: 5672, 
  username: 'guest', 
  password: 'guest' 
};

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(rabbitmqConfig); 
    const channel = await connection.createChannel();
    console.log('Post service rabbitmq server connected and channel created');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
}

module.exports = {
    connectRabbitMQ
};