const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const models = require("./models");
const allRoutes = require("./controllers");
const seed = require("./seeds/seed");

//Image
// const Grid = require("gridfs-stream");
// const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

// Defining middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json())
// Serving static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Connect to MongoDB
// Change boolean to true to reseed database on server start
const reseedOnConnect = false;
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/plannit", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(async () => {
    if (reseedOnConnect) {
      await Promise.all([
        models.User.deleteMany({}),
        models.Map.deleteMany({}),
        models.Chat.deleteMany({}),
        models.Suggestion.deleteMany({}),
        models.PotentialUser.deleteMany({}),
      ]);
      seed();
    }
  });

// Image create  connection
// const conn = mongoose.createConnection (process.env.MONGODB_URI || "mongodb://localhost/plannit")

//Image initiate gfs 
// let gfs;

// conn.once("open", ()=>{
//   //init stream
//   gfs=Grid(conn.db, mongoose.mongo)
//   gfs.collection("Map")
// })



// CORS
// Uncomment for development
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://travelplanit.herokuapp.com",
    credentials: true,
  })
);

//SESSION
// for heroku deploy uncomment proxy, samesite and secure
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    },
  })
);

// API routes
app.use("/", allRoutes);

let server = app.listen(PORT, () => {
  let io = require("socket.io").listen(server);
  console.log("connected")
  io.on("connection", (socket) => {
    socket.emit("your id", socket.id);
    // console.log("1st listen")
    socket.on("new message", (e) => {
      io.emit("update messages");
      console.log("message sent", e)
    });
  });

  console.log(
    `🌎 ==> API server now listening on port ${PORT}! http://localhost:${PORT}`
  );
});
