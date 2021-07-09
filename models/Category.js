const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  categoryName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  outcome: [
    {
      outcomeDescription: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Categories = mongoose.model("category", CategorySchema);
