const express = require("express");
const router = express.Router();
const db = require("../models");

// Get all chats in the database
// Passed test call
router.get("/", (req, res) => {
  db.Chat.find({})
    .then(allChats => {
      res.json(allChats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Get all chats for a specific map
// Passed test call
router.get("/map/:mapId", (req, res) => {
  db.Chat.find({ map: req.params.mapId })
    .populate("user", "username name")
    .then(allMapChats => {
      res.json(allMapChats)
      res.status(204).end()
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
})


// Session Conditional >> When ready, uncomment
router.post("/new", (req, res) => {
  if (!req.session.user) {
    res.status(401).send("login required")
  } else {
    db.Chat.create({
      user: req.session.user.id,
      map: req.body.mapId,
      message: req.body.message,
    }).then(newChat => {
      res.json(newChat);
      res.status(204).end()
    }).catch(err => {
      console.log(err);
      res.status(500).end()
    })
  }
})

// Delete chat
// Passed test call
router.delete("/delete", (req, res) => {
  db.Chat.deleteOne({
    _id: req.body.chatId,
  }).then(deleteData => {
    res.json(deleteData)
    res.status(204).end()
  }).catch(err => {
    console.log(err)
    res.status(500).end()
  })
})


module.exports = router;
