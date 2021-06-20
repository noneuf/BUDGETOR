const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Category = require("../../models/Category");
const User = require("../../models/Category");
// @route     GET api/category/me
// @desc      Get current users category
// @access    Public
router.get("/me", auth, async (req, res) => {
  try {
    const category = await Category.findOne({ user: req.user.id }).populate(
      "user", //from where you want to take the the info
      ["name", "avatar"] // what you want to get from the user
    );

    if (!category) {
      return res
        .status(400)
        .json({ msg: "There is no category for this user" });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/category
// @desc      Create or update users category
// @access    Private
router.post(
  "/check",
  [auth, [check("status", "Status is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryName } = req.body;

    // Build category object
    const categoryFields = {};
    categoryFields.user = req.user.id;
    if (categoryName) categoryFields.location = categoryName;

    try {
      let category = await Category.findOne({ user: req.user.id });

      if (category) {
        //If category exists so we Update it
        category = await Category.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: /*what is $set in mongoose: https://docs.mongodb.com/manual/reference/operator/aggregation/set/  */ categoryFields,
          },
          { new: true } //set the "new" option to "true" to return the document after update was applied
        );
        return res.json(category);
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

// @route     GET api/category
// @desc      Get all categories
// @access    Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("user", [
      "name",
      "avatar",
    ]);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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

module.exports = router;
