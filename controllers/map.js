const express = require("express");
const router = express.Router();
const db = require("../models");

// Get all maps in the database
// Passed test call
router.get("/", (req, res) => {
  db.Map.find({})
    .then((allMaps) => {
      res.json(allMaps);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Get one map by id
// Passed test call
router.get("/one/id", (req, res) => {
  db.Map.findOne({ _id: req.body.id })
    .then((map) => {
      res.json(map);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Create a new map
// Passed test call
router.post("/new", (req, res) => {
  // if(!req.session.user){
  //   res.status(401).send("login required")
  // } else{
    const { name, guests, dates, destinations } = req.body;
    db.Map.create({
      name: name,
      // creatorId: req.session.user.id,
      dates: {
        start: dates ? dates.start : "",
        end: dates ? dates.end : "",
      },
      guests: guests,
      destinations: destinations,
    }).then(newMap => {
      res.json(newMap)
      res.status(204).end()
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  // }
  
});

// Delete map
// Passed test call
router.delete("/delete", (req, res) => {
  db.Map.deleteOne({
    _id: req.body.id,
  }).then(async (mapDel) => {
    try {
      const deletePromises = [];
      const sugDel = await db.Suggestion.deleteMany({ mapId: req.body.id });
      const chatDel = await db.Chat.deleteMany({ mapId: req.body.id });
      deletePromises.push(mapDel, sugDel, chatDel);
      const deleteData = await Promise.all(deletePromises);
      res.json({
        map: deleteData[0],
        suggestions: deleteData[1],
        chats: deleteData[2],
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
