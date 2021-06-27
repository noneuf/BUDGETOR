const mongoose = require("mongoose");

const OutcomeSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
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
});

module.exports = Outcomes = mongoose.model("outcome", OutcomeSchema);
