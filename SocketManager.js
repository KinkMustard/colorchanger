const mongoose = require("mongoose");
const { io } = require("./index");

const { GET_COLOR, CHANGE_COLOR, UPDATE_COLOR } = require("./client/src/Events");
require("./models/Color");

const ColorModel = mongoose.model("colors");

module.exports = async (socket) => {
  console.log("New client connected");
  const updatedColor = await ColorModel.findById("5ad939425c092f2ad4798c6f");
  const temp = updatedColor.currentColor;
  console.log(temp);
  socket.emit(GET_COLOR, temp);

  socket.on(CHANGE_COLOR, (color) => {
    console.log("Color Changed to: ", color);
    // io.sockets.emit("change color", color);
    io.emit(UPDATE_COLOR, color);
    // const createColor = new ColorModel({
    //   currentColor: color
    // });
    // await createColor.save();
    ColorModel.findByIdAndUpdate(
      "5ad939425c092f2ad4798c6f",
      {
        currentColor: color
      },
      { upsert: true },
      () => {
        console.log("color updated");
      }
    );
    // await createColor.save();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};
