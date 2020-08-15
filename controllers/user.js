const express = require("express");
const router = express.Router();
const db = require("../models");

// Get all users in the database
// Passed test call
router.get("/", (req, res) => {
  db.User.find({})
    .then((allChats) => {
      res.json(allChats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Get one user by id
// Passed test call
router.get("/one/id", (req, res) => {
  db.User.findOne({ _id: req.body.id })
    .then((map) => {
      res.json(map);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Delete users by id
// Passed test call
router.delete("/delete", (req, res) => {
  console.log(req.body.id);
  db.User.deleteOne({
    _id: req.body.id,
  }).then(async (userDel) => {
    try {
      const deletePromises = [];
      const mapDel = await db.Map.deleteMany({ creatorId: req.body.id });
      const sugDel = await db.Suggestion.deleteMany({ userId: req.body.id });
      const chatDel = await db.Chat.deleteMany({ userId: req.body.id });
      deletePromises.push(userDel, mapDel, sugDel, chatDel);
      const deleteData = await Promise.all(deletePromises);
      res.json({
        user: deleteData[0],
        maps: deleteData[1],
        suggestions: deleteData[2],
        chats: deleteData[3],
      });
    } catch {
      console.log(error);
      res.status(500).end();
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

module.exports = router;
