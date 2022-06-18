const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// for CORS policy
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
// global.onlineRooms = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("join-room", (data) => {
    // console.log("onlineRooms.get(data.room)", onlineRooms.get(data.room));
    // onlineRooms.set(data.room, [
    //   ...(onlineRooms.get(data.room) || []),
    //   {
    //     ...data,
    //     socket: socket.id,
    //   },
    // ]);
    console.log("data.room", data.room);
    socket.join(data.room);
    io.to(data.room).emit("msg-recieve", {
      msg: `${data.username} has joined the chat`,
      type: "general",
      room: data.room,
    });
  });

  socket.on("send-msg", (data) => {
    if (data.fromGroup) {
      socket.broadcast.to(data.group).emit("msg-recieve", {
        msg: data.msg,
        sender: { username: data.username || "unknown" },
      });
      return;
    } else {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket
          .to(sendUserSocket)
          .emit("msg-recieve", { msg: data.msg, sender: "anoynoums" });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("leaving..");

    // for (const item of onlineRooms.entries()) {
    //   console.log("item", item);
    // }

    // onlineRooms.set(data.room)

    // onlineUsers.set(userId, socket.id);
    // socket.broadcast
    //   .to(socket.id)
    //   .emit("msg-recieve", `one of the user has left the chat`);
    // socket.rooms.size === 0
  });
});
