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

//route for new vote 
router.post("/vote/:suggestionId", (req, res) => {
  console.log(req.body)
  db.Suggestion.findOne({
    _id: req.params.suggestionId
    
  })
  .then(data => {
      // console.log("this is the data",data)
    let voteThing = false
    for(i=0; i<data.votes.length; i++){
      if(data.votes[i].userId.equals(req.session.user.id)){
        voteThing = true
        
      } 
      console.log("votes",data.votes[i].userId)
    }
    console.log("this is the user", req.session.user)
    if(voteThing===false){
      data.votes.push({
        userId: req.session.user.id,
        vote: req.body.vote
      })
      data.save()
      return res.send(true)

    }
    return res.status(403).end()
   
    
  })
})

//route for new comment 
router.post("/comment/:suggestionId", (req, res) => {
  console.log(req.body)
  db.Suggestion.findOne({
    _id: req.params.suggestionId
  })
  .then(data => {
      // console.log("this is the data",data)
    data.comments.push({
      userId: req.session.user.id,
      message: req.body.message
    })
    data.save()
    res.json(data)
  })
})

router.get("/comments/:suggestionId", (req, res) => {
  // console.log("this is the thing", req.body)
  db.Suggestion.findOne({
    _id:req.params.suggestionId
    
  }).populate("userId", "username name")
  .then(data=>{
    console.log("this is the suggestion", data)
    console.log("all Comments", data.comments)
    res.json(data.comments)
  }).catch(err=>{
    console.log("why this is happening",err)
  })
})


module.exports = router;

