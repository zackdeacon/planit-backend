const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const app = express();
const models = require("./models");
const seed = require("./seeds/seed");
var allRoutes = require("./controllers");
const router = require("./controllers/auth")
var db = require("./models");
const nodemailer = require("nodemailer")


//Nodemailer set up 

//Creating Transporter 
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zackdeacon347@gmail.com',
    pass: 'Senior10'
  }
});

//Creating message outline 
var mailOptions = {
  from: 'zackdeacon347@gmail.com',
  to: 'recipient address',
  subject: 'Welcome to PLANiT!',
  text: `Welcome to PLANiT! We're excited to assist you with all of your trip planning needs. If you have any concerns about our app please report Vinny to the appropriate authorities immediately. Good day!` 
}

//Error catching or success status 
transporter.sendMail(mailOptions, function(error, info){
  if(error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response)
  }
})

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

//SESSION
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

// API routes
app.use("/", allRoutes);

let server = app.listen(PORT, () => {
  let io = require("socket.io")(server);
// server side set up for socket.io
io.on("connection", (socket) => {
  console.log("it worked");
  socket.emit("your id", socket.id);
  // socket.emit("your name", req.session.name);
  socket.on("send message", (body) => {
    console.log("Sending Message");
    io.emit("message", body);
  });
});

  console.log(
    `🌎 ==> API server now listening on port ${PORT}! http://localhost:${PORT}`
  );
});

// let io = require("socket.io")(server);

// // server side set up for socket.io
// io.on("connection", (socket) => {
//   console.log("it worked");
//   socket.emit("your id", socket.id);
//   socket.on("send message", (body) => {
//     console.log("Sending Message");
//     io.emit("message", body);
//   });
// });

  //attempt for Mongo
  let chats = db.collection("chats");
  chats.find().limit(100).sort(socket.id).toArray(function(err,res){
    if(err){
      throw err;
    }
    socket.emit("output", res);
  })
  //handle input events
  socket.on("input", function(data){
    let name = data.name;
    let message= data.message;

    chats.insert({name: name, message: message}, function(){
      client.emit("output", [data]);
    })
  })

