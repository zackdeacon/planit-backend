const express = require("express");
const router = express.Router();
const db = require("../models");

// Get all users in the database
// Passed test call
router.get("/", (req, res) => {
  db.PotentialUser.find({})
    .then((allPotentialUsers) => {
      res.json(allPotentialUsers);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

module.exports = router;


