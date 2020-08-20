const express = require("express");
const router = express.Router();
const db = require("../models");

// Get all suggestions in the database
// Passed test call
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

// Get all suggestions for a specific map
// Passed test call
router.get("/map/:mapId", (req, res) => {
  db.Suggestion.find({
    mapId: req.params.mapId
  })
  .populate("userId", "username name")
  .then(allMapSuggestions => {
    res.json(allMapSuggestions)
    res.status(204).end()
  }).catch(err => {
    console.log(err)
    res.status(500).end()
  })
})

// Add suggestion to suggestion collecton
// Passed test call
router.post("/new", (req, res) => {
  if (!req.session.user) {
    res.status(401).send("login required")
  } else {
    db.Suggestion.create({
      userId: req.session.user.id,
      mapId: req.body.mapId,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      link: req.body.link,
      cost: req.body.cost,
    }).then((newSuggestion) => {
      res.json(newSuggestion);
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    });
  }
});


// Delete a suggestion by id
// Passed a test call
router.delete("/delete", (req, res) => {
  db.Suggestion.deleteOne({
    _id: req.body.id,
  }).then((data) => {
    res.json(data);
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

//route for vote 
router.post("/vote/:suggestionId", (req, res) => {
  console.log(req.body)
  db.Suggestion.findOne({
    _id: req.params.suggestionId
  }).then(data => {
      console.log("this is the data",data)
    data.votes.push({
      userId: req.session.user.id,
      vote: req.body.vote
    })
    data.save()
  })
})

//route for comment 
router.post("/comment/:suggestionId", (req, res) => {
  console.log(req.body)
  db.Suggestion.findOne({
    _id: req.params.suggestionId
  }).then(data => {
      console.log("this is the data",data)
    data.comments.push({
      userId: req.session.user.id,
      message: req.body.message
    })
    data.save()
  })
})


module.exports = router;

