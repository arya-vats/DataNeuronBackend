const mongoose = require("mongoose");

const stringDataSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
});

const dataSchema = new mongoose.Schema({
  data: [stringDataSchema],
  count_add: {
    type: Number,
    required: true,
  },
  count_update: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Data", dataSchema);
