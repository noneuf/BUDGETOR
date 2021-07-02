const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Outcome = require("../../models/Outcome");
const User = require("../../models/User");

//@route     POST api/outcome
//@desc      Create or update outcome
//@access    Private
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

// @route     GET api/outcome
// @desc      Get all Outcomes
// @access    private
router.get("/", auth, async (req, res) => {
  try {
    const outcomes = await Outcome.find().populate("outcome", [
      "amount",
      "description",
    ]);
    res.json(outcomes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/outcome/category/:category_id
// @desc      Get outcomes by category ID
// @access    Public
router.get("/category/:category_id", async (req, res) => {
  try {
    const outcomes = await Outcome.find({
      category: req.params.category_id,
    }).populate("category", ["categoryName"]);

    if (!outcomes) return res.status(400).json({ msg: "Outcome(s) not found" });

    res.json(outcomes);
  } catch (err) {
    console.error(err.message);
    // If the error is in the id we pass in ass a parmater of the request we want to return a specific message saying thecategory is not found
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Outcome(s) not found" });
    }
    // if its any error that as nothing to do with the category id we return server error message
    res.status(500).send("Server Error");
  }
});

module.exports = router;
