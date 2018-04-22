const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = (module.exports.io = require("socket.io")(server));
const mongoose = require("mongoose");

const SocketManager = require("./SocketManager");
require("./models/Color");

const ColorModel = mongoose.model("colors");

mongoose.connect("mongodb://KinkMustard:Czy4306162@ds149309.mlab.com:49309/imageboard");

io.on("connection", SocketManager);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`);
});
