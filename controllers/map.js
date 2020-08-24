const express = require("express");
const router = express.Router();
const db = require("../models");
const inviter = require("./utils/invitations");

//Image
// const GridFsStorage = require("multer-gridfs-storage");
// const multer = require("multer");
// const crypto = require("crypto");


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

router.put("/categories/add", (req, res) => {
  const { mapId, newCategory } = req.body;
  db.Map.findById(mapId).then(async (map) => {
    const catsLower = map.suggestionCategories.map(cat => cat.toLowerCase());
    if (catsLower.includes(newCategory.toLowerCase())) {
      res.json({
        successful: false,
        message: "Category already exists.",
        categories: map.suggestionCategories,
      });
    } else {
      map.suggestionCategories.push(newCategory);
      await map.save();
      res.json({
        successful: true,
        message: `${newCategory} added to suggestion categories.`,
        categories: map.suggestionCategories,
      });
    }
  })
});

router.put("/categories/remove", (req, res) => {
  const { mapId, category } = req.body;
  db.Map.findById(mapId).then(async (map) => {
    const removeIndex = map.suggestionCategories.indexOf(category);
    if (removeIndex >= 0) {
      map.suggestionCategories.splice(removeIndex, 1);
      db.Suggestion.deleteMany({
        mapId: mapId,
        category: category,
      });
      await map.save();
      res.json({
        successful: true,
        message: "Category removed",
        categories: map.suggestionCategories,
      });
    } else {
      res.json({
        successful: false,
        message: "Category not found",
        categories: map.suggestionCategories,
      });
    }
  })
});

router.put("/invite", (req, res) => {
  const { mapId, guestEmail } = req.body;
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



//Image create storage engine
// var storage = new GridFsStorage({
//   url: process.env.MONGODB_URI || "mongodb://localhost/plannit",
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'Map'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });

//upload image
// router.post("/images/new/:mapId",(req,res)=>{
//   console.log(req.body)
//   db.Map.findOne({ _id: req.params.mapId })
//   .then(data=>{
//     console.log('data', data)
//     upload.single()
//     data.images.push({
//       images: req.body.images      
//     })
//     data.save()
//     res.json({file:req.data})
//   })
// })

module.exports = router;
