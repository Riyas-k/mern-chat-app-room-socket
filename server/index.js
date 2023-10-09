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

app.get("/", (req, res) => {
  res.send("hello");
});
io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.on("joinRoom", (room) => socket.join(room));

  socket.on("newMessage", ({newMessage,room})=>{
    io.in(room).emit('getNewMessage',newMessage)
  });
});

server.listen(5000, () => {
  console.log("server started");
});
