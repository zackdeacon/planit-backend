const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
  db.Map.find({})
    .then((allChats) => {
      res.json(allChats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

router.post("/new", (req,res)=>{
  db.Map.create({
    name: req.body.name,
    creator: req.body.creator,
    guests: req.body.guests,
    dates: {
      start: req.body.dates.start,
      end: req.body.dates.end
    },
    destinations: req.body.destinations,
  }).then(newMap=>{
    res.json(newMap)
    res.status(204).end()
  }).catch(err=>{
    console.log(err)
    res.status(500).end()
  })
})
module.exports = router;
