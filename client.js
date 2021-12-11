const readline = require("readline");
const net = require("net");
const config = require("./config");

const clearPrompt = (stream) => {
  readline.clearLine(stream, 0);
  readline.cursorTo(stream, 0);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "-->"
});

const socket = new net.Socket();

socket.on("data", data => {
  clearPrompt(process.stdin);

  const parsed = JSON.parse(data);
  console.log(`[${parsed.sender}]: ${parsed.message}`);

  rl.prompt();
});

socket.on("close", () => {
  console.log("Connection is closed. Bye...");
  rl.close();
});

socket.on("error", err => {
  if (err.code === "ECONNREFUSED") {
    console.log("Server is not available now...");

    rl.close();
  }
});

socket.on("ready", () => {
  rl.question("Enter your name: ", name => {
    rl.write("----------WELCOME TO CHANNEL----------\n");
    rl.prompt();

    rl.on("line", input => {
      const message = input.trim();

      if (message) {
        socket.write(JSON.stringify({sender: name, message: input}));
      }

      rl.prompt();
    });
  });
});

socket.connect(config);
