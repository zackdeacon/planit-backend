const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../models");

// Get all suggestions from all maps and users
router.get("/", (req, res) => {
  db.Suggestion.find({})
    .then((allChats) => {
      res.json(allChats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Add suggestion to suggestion collecton
router.post("/new", (req, res) => {
  db.Suggestion.create({
    author: req.session.user.id,
    map: req.body.map,
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    link: req.body.link,
    cost: req.body.cost,
  }).then((suggestionDoc) => {
    res.json(suggestionDoc);
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

// Delete suggestion
router.delete("/delete", (req, res) => {
  db.Suggestion.deleteOne({
    _id: req.body.suggestionId,
  }).then((deleted) => {
    res.json(deleted);
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

// Delete

module.exports = router;
