const mongoose = require("mongoose");

const GroupMessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // this will be array in future
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Groups" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);
