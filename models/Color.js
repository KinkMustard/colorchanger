const mongoose = require("mongoose");

const { Schema } = mongoose;

const colorSchema = new Schema({
  currentColor: String
});

mongoose.model("colors", colorSchema);
