const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const models = require("./models");
const seed = require("./seeds/seed");
var allRoutes = require('./controllers');

//sessions
const session = require("express-session")

// Defining middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Connect to MongoDB
// Change boolean to true to reset database on server start
const reseedOnConnect = true;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/plannit", 
  { useNewUrlParser: true }
).then(async () => {
  if (reseedOnConnect) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Map.deleteMany({}),
      models.Chat.deleteMany({}),
      models.Suggestion.deleteMany({}),
    ])
    seed();
  }
})

//SESION
app.use(session({
  //secret string that will encrypt sessions
  secret: "planit",
  resave: false,
  saveUninitialized: true,
  //the session will last for 2 hours
  cookie: {
    maxAge: 7200000
  }
}))

// API routes
app.use('/',allRoutes);

// Sending every other request to the PLANiT React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now listening on port ${PORT}!`);
});
