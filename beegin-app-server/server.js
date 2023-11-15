const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socket = require("socket.io");

const { updateMessageStatus } = require("./services/messageServices");
const trendingServices = require("./services/trendingServices");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

const conSuccess = mongoose.connection;
conSuccess.once("open", () => {
  //run this every certain time after database connection successfully
  setInterval(trendingServices.determineTrendingHashtags, 60000);
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

let onlineUsers = [];
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.push({ userId: userId, socketId: socket.id });
    io.sockets.emit("get-users", onlineUsers.map(user => user.userId));
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("user disconnected", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers.map(user => user.userId));
  });

  socket.on("offline", () => {
    // remove user from active users
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("user is offline", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers.map(user => user.userId));
  });

  socket.on("typing", (data) => {
    const user = onlineUsers.find((user) => user.userId === data.receiver);
    console.log("typing")
    if (user) {
      socket.to(user.socketId).emit("get-typing", data);
      // console.log("typing: " + data)
    }
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.find((user) => user.userId === data.receiver);
    if (sendUserSocket) {
      socket.to(sendUserSocket.socketId).emit("msg-receive", data);
    }
  });

  socket.on("message-seen-status", (data) => {
    data.status = "seen";
    updateMessageStatus(data.userId, data.receiver, data.status);
    const sendUserSocket = onlineUsers.find((user) => user.userId === data.receiver);
    // console.log("Message seen by: ", data)
    if (sendUserSocket) {
      socket.to(sendUserSocket.socketId).emit("message-seen");
    }
  });

  socket.on("react", (data) => {
    const sendUserSocket = onlineUsers.find((user) => user.userId === data.receiver);
    if(sendUserSocket) {
      socket.to(sendUserSocket.socketId).emit("reaction-receive", data)
    }
  })
});



process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
