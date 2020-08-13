const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const models = require("./models");

// Defining middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Connect to MongoDB
// Change boolean to true to reset database on server start
const reseedOnConnect = false;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/plannit", 
  { useNewUrlParser: true }
).then(async () => {
  if (reseedOnConnect) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Board.deleteMany({}),
      models.Chat.deleteMany({}),
      models.Suggestion.deleteMany({}),
    ])
    // seed();
  }
})

// API routes

// Sending every other request to the PLANiT React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

let server;


server = app.listen(PORT, () => {
  console.log(`🌎 ==> API server now listening on port ${PORT}!`);
});




let io = require("socket.io")(server);

// server side set up for socket.io
io.on("connection", socket => {
  console.log("it worked")
  socket.emit("your id", socket.id);
  socket.on("send message", body => {
    console.log("Sending Message")
    io.emit("message", body)
  })
});

