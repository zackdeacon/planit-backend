const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("../nodemailer");

// Get all users in the database
router.get("/", (req, res) => {
  db.User.find({})
    .then((allUsers) => {
      res.json(allUsers);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Accept invitation
router.put("/invitation/accept", (req, res) => {
  db.User.findById(req.session.user.id)
    .then(async (user) => {
      user.invitations.splice(req.body.index, 1);
      user.guestMaps.push(req.body.mapId);
      const updatedUser = await user.save();
      res.json(updatedUser);
    })
    .catch((err) => {
      res.status(500).end(err);
    })
})

// Decline invitation
router.put("/invitation/decline", (req, res) => {
  db.User.findById(req.session.user.id)
    .then(async (user) => {
      user.invitations.splice(req.body.index, 1);
      const updatedUser = await user.save();
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end(err);
    })
})

// Change user's name
router.put("/change/name", (req, res) => {
  db.User.findById(req.session.user.id)
    .then(async (user) => {
      const newName = { first: user.name.first, last: user.name.last };
      if (req.body.first) {
        newName.first = req.body.first;
      }
      if (req.body.last) {
        newName.last = req.body.last;
      }
      user.name = newName;
      const updatedUser = await user.save();
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    })
})

// Reset password
router.put("/reset/password", (req, res) => {
  console.log(req.body)
  db.User.findById(req.body.userId)
    .then(async (user) => {
      const { username, name, email } = user;
      var tempPass = Math.random().toString(36).slice(-8);
      user.password = tempPass;
      await user.save();

      nodemailer.sendEmail({
        to: email,
        subject: nodemailer.passwordReset.subject(user.username),
        text: nodemailer.passwordReset.text({ username, name, tempPass }),
        html: nodemailer.passwordReset.html({ username, name, tempPass }),
      })
      res.json({ username, email });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    })
})

// Change user password
router.put("/change/password", (req, res) => {
  db.User.findById(req.session.user.id)
    .then(async (user) => {
      const { oldPassword, newPassword } = req.body;
      let success, message;
      if (bcrypt.compareSync(oldPassword, user.password)) {
        user.password = newPassword;
        await user.save();
        success = true;
        message = "Password updated successfully!";
      } else {
        success = false;
        message = "Old password incorrect!";
      }
      res.json({ username: user.username, success, message });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    })
})

// Get one user by id
router.get("/one/id/:userId", (req, res) => {
  db.User.findOne({ _id: req.params.userId })
    .populate("createdMaps")
    .populate("guestMaps")
    .populate("invitations", "name _id creator")
    .exec()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Get one user by username
router.get("/one/username/:username", (req, res) => {
  db.User.findOne({ username: req.params.username })
    .populate("createdMaps")
    .populate("guestMaps")
    .populate("invitations", "name _id creator")
    .exec()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

// Delete users by id
router.delete("/delete/:userId", (req, res) => {
  db.User.deleteOne({
    _id: req.params.userId,
  }).then(async (userDel) => {
    try {
      const deletePromises = [];
      const mapDel = await db.Map.deleteMany({ creatorId: req.params.userId });
      const sugDel = await db.Suggestion.deleteMany({ userId: req.params.userId });
      const chatDel = await db.Chat.deleteMany({ user: req.params.userId });
      deletePromises.push(userDel, mapDel, sugDel, chatDel);
      const deleteData = await Promise.all(deletePromises);
      req.session.destroy();
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

// Upload Profile Picture 
router.post("/picture/:userId", (req, res) => {
  console.log('req.body.image', req.body.image)
  db.User.findOne({ _id: req.params.userId })
    .then(data => {
      console.log('data', data)
      data.image.push(req.body.image)
      console.log('data.image', data.image)
      data.save()
      res.json(data)
    })
    .catch(err => {
      console.log('err', err)
      // connection.end()
    })
})

module.exports = router;
