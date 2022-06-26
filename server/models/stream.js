const mongoose = require("mongoose");

const StreamSchema = mongoose.Schema(
  {
    title: {
      text: { type: String, required: true },
    },
    slug: {
      text: { type: String, required: true, unique: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Steams", StreamSchema);
