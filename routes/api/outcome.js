const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Outcome = require("../../models/Outcome");
const User = require("../../models/Outcome");

// @route     POST api/outcome
// @desc      Create or update outcome outcome
// @access    Private
router.post(
  "/",
  [
    auth,
    [check("amount", "Amount is required").not().isEmpty()],
    [check("category", "Category is required").not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, outcomeDescription } = req.body;

    // Build outcome object
    const outcomeFields = {};
    // WHY req.category.id IS UNKNOWN?????????????????????
    console.log("HERE" + req.body.category);
    outcomeFields.category = req.body.category;

    if (amount) outcomeFields.amount = amount;
    if (outcomeDescription)
      outcomeFields.outcomeDescription = outcomeDescription;

    try {
      let outcome = await Outcome.findOne({
        amount: amount,
        category: req.body.category,
      });

      //   if (outcome) {
      //     //If outcome exists we dont want to create it again, but we return a message to the user to inform him that the outcome allready exists

      //     const outcomeAlreadyExistsMsg = `Outcome "${amount}" allready exists`;
      //     return res.send(outcomeAlreadyExistsMsg);
      //   }

      //Else outcome does not exists so we Create it
      outcome = new Outcome(outcomeFields);

      await outcome.save();
      res.json(outcome);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
