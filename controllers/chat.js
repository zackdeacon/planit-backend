const express = require("express");
const router = express.Router();
const db = require("../models");

// Get all chats from all maps and users
router.get("/all", (req, res) => {
  db.Chat.find({})
    .then((allChats) => {
      res.json(allChats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

module.exports = router;
