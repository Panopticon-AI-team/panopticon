import { RawData, WebSocket, WebSocketServer } from 'ws';
import * as http from 'http'
import { v4 as uuidv4 } from "uuid";

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8080;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const clients: { [key: string]: WebSocket } = {};

// Event types
const eventTypesDef = {
  LOAD_SCENARIO: 'loadscenario',
  STEP_SCENARIO: 'stepscenario',
}

function broadcastMessage(json: any) {
  const data = JSON.stringify(json);
  for(let userId in clients) {
    let client = clients[userId];
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  };
}

function handleMessage(message: RawData) {
  const { type, content} = JSON.parse(message.toString());
  console.log('type:', type, 'content: ', content);
  if (type === eventTypesDef.LOAD_SCENARIO) {
    console.log('Loading scenario');
    // broadcastMessage({content: 'content'})
  } else if (type === eventTypesDef.STEP_SCENARIO) {
    console.log('Stepping scenario');
  }
}

function handleDisconnect(userId: string) {
    console.log(`${userId} disconnected.`);
    delete clients[userId];
}

// A new client connection request received
wsServer.on('connection', function(connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log('Received a new connection');

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
  connection.on('message', (message) => handleMessage(message));
  // User disconnected
  connection.on('close', () => handleDisconnect(userId));
});
