const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const models = require("./models");
const seed = require("./seeds/seedDB");

// Defining middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Connect to MongoDB
// Change boolean to false to prevent resetting database on start
const eraseDatabaseOnSync = true;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/plannit", 
  { useNewUrlParser: true }
).then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Board.deleteMany({}),
      models.Chat.deleteMany({}),
      models.Suggestion.deleteMany({}),
    ])
  }
})

// API routes

// Sending every other request to the PLANiT React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now listening on port ${PORT}!`);
});
