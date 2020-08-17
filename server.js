const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const models = require("./models");
const allRoutes = require("./controllers");
const seed = require("./seeds/seed");

const app = express();
const PORT = process.env.PORT || 8080;


//Nodemailer set up 

//Creating Transporter 
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'zackdeacon347@gmail.com',
//     pass: 'Senior10'
//   }
// });

//Creating message outline 
// var mailOptions = {
//   from: 'zackdeacon347@gmail.com',
//   to: 'recipient address',
//   subject: 'Welcome to PLANiT!',
//   text: `Welcome to PLANiT! We're excited to assist you with all of your trip planning needs. If you have any concerns about our app please report Vinny to the appropriate authorities immediately. Good day!` 
// }

//Error catching or success status 
// transporter.sendMail(mailOptions, function(error, info){
//   if(error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response)
//   }
// })

//End of Nodemailer set up

// Defining middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Connect to MongoDB
// Change boolean to true to reseed database on server start
const reseedOnConnect = true;
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
      ]);
      seed();
    }
  });

// CORS
// Uncomment for development
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/chat"],
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

//SESSION
// for heroku deploy uncomment proxy, samesite and secure
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // proxy: true,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      // sameSite: "none",
      // secure: true,
    },
  })
);

// API routes
app.use("/", allRoutes);

let server = app.listen(PORT, () => {
  let io = require("socket.io")(server);
  io.on("connection", (socket) => {
    socket.emit("your id", socket.id);

    socket.on("new message", () => {
      io.emit("update messages");
    });
  });

  console.log(
    `🌎 ==> API server now listening on port ${PORT}! http://localhost:${PORT}`
  );
});
