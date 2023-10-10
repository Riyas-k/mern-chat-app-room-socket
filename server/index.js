const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  try {
    socket.on("joinRoom", (room) => socket.join(room));

    socket.on("newMessage", ({ newMessage, room }) => {
      io.in(room).emit("getNewMessage", newMessage);
    });
  } catch (error) {
    console.log("Socket error", error);
  }
});

server.listen(5000, () => {
  console.log("server started");
});
