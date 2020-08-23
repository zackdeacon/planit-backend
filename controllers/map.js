const express = require("express");
const router = express.Router();
const db = require("../models");
const inviter = require("./utils/invitations");

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
router.get("/one/id/:mapId", (req, res) => {
  db.Map.findOne({ _id: req.params.mapId })
    .populate("creatorId", "username name")
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
  if (!req.session.user) {
    res.status(401).send("login required")
  } else {
    const { name, guests, dates, destinations } = req.body;
    db.Map.create({
      name: name,
      creator: req.session.user.username,
      creatorId: req.session.user.id,
      dates: {
        start: dates ? dates.start : "",
        end: dates ? dates.end : "",
      },
      guests: guests,
      destinations: destinations,
    }).then(newMap => {
      db.User.findById(newMap.creatorId).then(user => {
        user.createdMaps.push(newMap._id);
        user.save();
      }).catch(err => {
        console.log(err, "no user found");
        res.status(500).end()
      })
      // Invite guests
      const inviterInfo = {
        tripName: newMap.name,
        mapId: newMap._id,
        creatorId: newMap.creatorId,
        guestEmails: newMap.guests,
      };
      inviter.inviteGuests(inviterInfo);
      res.json(newMap)
      res.status(204).end()
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  }
});

router.put("/invite", (req, res) => {
  const { mapId, guestEmail } = req.body
  db.Map.findById(mapId).then(async (map) => {
    if (map.guests.includes(guestEmail)) {
      res.json({
        message: `${guestEmail} already invited`,
        successful: false,
        guests: map.guests,
      })
    } else {
      const inviterInfo = {
        tripName: map.name,
        mapId: map._id,
        creatorId: map.creatorId,
        newGuest: guestEmail,
        guestEmails: [guestEmail],
      };
      inviter.inviteGuests(inviterInfo);
      map.guests.push(guestEmail);
      await map.save();
      res.json({
        message: `${guestEmail} has been invited`,
        successful: true,
        newGuest: guestEmail,
        guests: map.guests,
      })
    }
  })
})

// Delete map
// Passed test call
router.delete("/delete", (req, res) => {
  db.Map.deleteOne({
    _id: req.body.id,
  }).then(async (mapDel) => {
    try {
      const deletePromises = [
        mapDel,
        await db.Suggestion.deleteMany({ mapId: req.body.id }),
        await db.Chat.deleteMany({ mapId: req.body.id }),
      ];
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

//upload image
router.post("/images/new/:mapId", (req,res)=>{
  console.log(req.body)
  db.Map.findOne({ _id: req.params.mapId })
  .then(data=>{
    console.log('data', data)
    data.images.push({
      images: req.body.images      
    })
    data.save()
    res.json(data)
  })
})

module.exports = router;
