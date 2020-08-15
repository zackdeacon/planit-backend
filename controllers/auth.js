const express = require("express");
const db = require("../models");
const router = express.Router();
//password encryption
const bcrypt = require("bcrypt");

//SIGN UP
router.post("/signup", (req, res) => {
  db.User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: {
      first: req.body.name.first,
      last: req.body.name.last,
    },
  })
    .then(function (newUser) {
      console.log(newUser);
      res.json(newUser);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err);
    });
});

//LOGIN
router.post("/login", (req, res) => {
  db.User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send("no such user");
      } else {
        //it will compare the passed in password to what is stored in the database
        console.log(user)
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //whenever i signin, add this object to my session key (will only show up after I signin)
          req.session.user = {
            id: user.id,
            username: user.username,
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
router.get("/readsessions", (req, res) => {
  res.json(req.session);
  
});

module.exports = router;
