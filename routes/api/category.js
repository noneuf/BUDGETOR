const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Category = require("../../models/Category");
const User = require("../../models/User");

// @route     POST api/category
// @desc      Create or update user category
// @access    Private
router.post(
  "/",
  [auth, [check("categoryName", "Category is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryName } = req.body;

    // Build category object
    const categoryFields = {};
    categoryFields.user = req.user.id;

    if (categoryName) categoryFields.categoryName = categoryName;

    try {
      let category = await Category.findOne({
        categoryName: categoryName,
        user: req.user.id,
      });
      console.log(category);

      if (category) {
        //If category existswe dont want to create it again, but we return a message to the user to inform him that the category allready exists

        const categoryAlreadyExistsMsg = `Category "${categoryName}" allready exists`;
        return res.send(categoryAlreadyExistsMsg);
      }

      //Else category does not exists so we Create it
      category = new Category(categoryFields);

      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     GET api/category/user/:user_id
// @desc      Get category by user ID
// @access    Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const category = await Category.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!category) return res.status(400).json({ msg: "Category not found" });

    res.json(category);
  } catch (err) {
    console.error(err.message);
    // If the error is in the id we pass in ass a parmater of the request we want to return a specific message saying thecategory is not found
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Category not found" });
    }
    // if its any error that as nothing to do with the category id we return server error message
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/category/:category_id/outcome
// @desc      Add category outcome
// @access    Private
router.put(
  "/outcome/:cat_id",
  [auth, [check("amount", "Amount is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, outcomeDescription } = req.body;

    const newOutcome = {
      amount, //remember this is a shortened syntax for: title: title
      outcomeDescription,
    };

    try {
      const category = await Category.findById(req.params.cat_id); //Make sure to do something.findById(req.params.cat_id) instead of something.findById({category: req.params.cat_id})

      category.outcome.unshift(newOutcome); // The unshift() method adds new items to the beginning of an array, and returns the new length

      await category.save();

      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
