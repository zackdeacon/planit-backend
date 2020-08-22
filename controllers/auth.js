const express = require("express");
const db = require("../models");
const router = express.Router();
//password encryption
const bcrypt = require("bcrypt");

//SIGN UP
router.post("/signup", (req, res) => {
  const { username, password, email, name } = req.body;
  db.User.create({
    username: username,
    password: password,
    email: email,
    name: {
      first: name ? name.first : "",
      last: name ? name.last : "",
    },
  })
    .then(async function (newUser) {
      req.session.user = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      };
      const potentialUser = await db.PotentialUser.findOne({ email: newUser.email });
      if (potentialUser) {
        newUser.invitations.push(...potentialUser.invitedMapIds);
        const dbOperationPromises = [
          await newUser.save(),
          await db.PotentialUser.deleteOne({ _id: potentialUser._id }),
        ];
        const dbOpertationResults = await Promise.all(dbOperationPromises);
        res.json({ newUser, dbOpertationResults });
      } else {
        console.log(newUser);
        res.json(newUser);
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err);
    });
});

//LOGIN
router.post("/login", (req, res) => {
  // console.log("here is the password", req.body.password)
  db.User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send("no such user");
      } else {
        console.log(user)
        if (bcrypt.compareSync(req.body.password, user.password)) {
          req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
          };
          res.send(req.session);
        } else {
          res.status(401).send("wrong password");
        }
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end();
    });
});

//LOG OUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("You have been logged out!");
});

//READ SESSIONS
router.get("/readsession", (req, res) => {
  res.json(req.session);

});

module.exports = router;
