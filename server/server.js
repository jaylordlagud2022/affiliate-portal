// server.js (ESM syntax since your package.json has "type": "module")
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // replace with your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// users: { socketId: { email, name, avatar } }
let users = {};
// chats: { email: [ { sender, name, avatar, message, timestamp } ] }
let chats = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", ({ email, name, avatar }) => {
    users[socket.id] = { email, name, avatar };
    if (!chats[email]) chats[email] = [];
    console.log(`${name} (${email}) registered`);
  });

  socket.on("send_message", ({ to, from, message }) => {
    const sender = Object.values(users).find((u) => u.email === from);
    const chatMsg = {
      sender: from,
      name: sender?.name || from,
      avatar: sender?.avatar || "https://i.pravatar.cc/40",
      message,
      timestamp: new Date(),
    };

    if (!chats[to]) chats[to] = [];
    chats[to].push(chatMsg);
    chats[from].push(chatMsg);

    const receiverSocketId = Object.keys(users).find(
      (key) => users[key].email === to
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", chatMsg);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
  });
});

server.listen(4000, () => {
  console.log("Chat server running on http:///192.168.254.100:4000");
});
