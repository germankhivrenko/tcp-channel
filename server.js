const net = require("net");
const config = require("./config");

const server = new net.Server();
const sockets = [];

server.on("close", () => {
  console.log("Server is closed.");
});

server.on("connection", socket => {
  sockets.push(socket);
  console.log("New server connection.");

  socket.on("data", data => {
    for (const s of sockets) {
      if (s !== socket) {
        s.write(data);
      }
    }
  });

  socket.on("close", () => {
    console.log("Connection closed.");
  });
});

server.on("listening", () => {
  console.log("Server is listening...");
});

server.listen(config);
