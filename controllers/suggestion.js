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

// Add suggestion to suggestion collecton and 
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
    db.Map.findOne({ _id: req.body.map }).then(associatedMap => {
      associatedMap.suggestions.push(suggestionDoc._id);
      associatedMap.save().then(updatedMap => {
        res.json(updatedMap)
      }).catch(err => {
        console.log(err);
        res.status(500).end();
      })
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    })
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

// Delete suggestion & its id from corresponding map array
router.delete("/delete", (req, res) => {
  db.Suggestion.deleteOne({
    _id: req.body.suggestionId,
  }).then((deleted) => {
    console.log(deleted);
    db.Map.findOne({ _id: req.body.mapId }).then(associatedMap => {
      const updatedSuggestions = associatedMap.suggestions.filter(sugg => {
        return sugg.id !== req.body.suggestionId
      });
      associatedMap.suggestions = updatedSuggestions;
      associatedMap.save().then(updatedMap => {
        res.json(updatedMap);
      }).catch(err => {
        console.log(err);
        res.status(500).end();
      })
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    })
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

// Delete

module.exports = router;
