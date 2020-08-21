const express = require("express");
const router = express.Router();
const db = require("../models");
const nodemailer = require("../nodemailer");

// * Different data than a mapId and an email can be passed in,
// * this is just an example
// * go to nodemailer/index.js then final render to edit the email
router.post("/send/map/render", async (req, res) => {
  const { mapId, email } = req.body;
  console.log(mapId, email);
  const map = await db.Map.findById(mapId);
  const suggestions = await db.Suggestion.find({ mapId: mapId });
  nodemailer.sendEmail({
    to: email,
    subject: nodemailer.finalRender.subject(map),
    text: nodemailer.finalRender.text({ map, suggestions }),
    html: nodemailer.finalRender.html({ map, suggestions }),
  }).then(data => {
    console.log(data);
    res.json(data)
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
})

module.exports = router;
