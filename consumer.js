const { Kafka } = require('kafkajs');
const express = require('express'); // 1. Import Express

const app = express();
const port = 3000;

// 2. In-Memory Store to cache events
const events = [];

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9093']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  // Connect to Kafka
  await consumer.connect();
  console.log('Connected to Kafka');
  
  await consumer.subscribe({ topic: 'tidb-test', fromBeginning: true });

  // 3. Define the Web Server API
  app.get('/', (req, res) => {
    // Return the events array as JSON when accessed by browser
    res.json({
      status: 'Online',
      count: events.length,
      data: events
    });
  });

  // Start the Web Server
  app.listen(port, () => {
    console.log(`Web Server running at http://localhost:${port}`);
  });

  // Consume Kafka Messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log('New Event:', value);
      
      // 4. Store event in memory instead of just logging
      try {
        const jsonValue = JSON.parse(value);
        events.unshift(jsonValue); // Add to the top of the list
      } catch (e) {
        events.unshift({ raw: value });
      }
    },
  });
};

run().catch(console.error);