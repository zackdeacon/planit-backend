const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const app = express();
const models = require("./models");
const seed = require("./seeds/seed");
var allRoutes = require("./controllers");

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
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/plannit", {
    useNewUrlParser: true,
  })
  .then(async () => {
    if (reseedOnConnect) {
      await Promise.all([
        models.User.deleteMany({}),
        models.Map.deleteMany({}),
        models.Chat.deleteMany({}),
        models.Suggestion.deleteMany({}),
      ]);
      seed();
    }
  });

// CORS
// Uncomment for development
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Uncomment for production
// app.use(
//   cors({
//     origin: ["OUR-APP-URL-HERE"],
//     credentials: true,
//   })
// );

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    },
  })
);

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
app.use("/", allRoutes);

let server = app.listen(PORT, () => {
  console.log(
    `🌎 ==> API server now listening on port ${PORT}! http://localhost:${PORT}`
  );
});

let io = require("socket.io")(server);

// server side set up for socket.io
io.on("connection", (socket) => {
  console.log("it worked");
  socket.emit("your id", socket.id);
  socket.on("send message", (body) => {
    console.log("Sending Message");
    io.emit("message", body);
  });
});
