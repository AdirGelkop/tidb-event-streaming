const { Kafka } = require('kafkajs');

//async function to run the consumer
const run = async () => {
  // 1. Config: Point to localhost because we are running on Mac
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9093'] 
  });

  const consumer = kafka.consumer({ groupId: 'test-group' });

  // 2. Connect to the broker
  await consumer.connect();
  console.log("Connected to Kafka");

  // 3. Subscribe: Topic name must match the Changefeed sink-uri
  // not fromBeginning: false to read only new messages
  await consumer.subscribe({ topic: 'tidb-test', fromBeginning: false });

  // 4. Run: Infinite loop to process incoming messages
  await consumer.run({
    eachMessage: async ({ message }) => {
      // Message comes as Buffer (binary), convert to String
      console.log(message.value.toString());
    },
  });
};

run().catch(console.error);