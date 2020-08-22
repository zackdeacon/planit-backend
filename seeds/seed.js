const models = require("../models");

// This file empties the Books collection and inserts the books below

const userSeed = [
  {
    username: "zackdeacon",
    password: "password",
    email: "zdeacon@planit.com",
    name: {
      first: "Zack",
      last: "Deacon",
    },
  },
  {
    username: "derek-watson14",
    password: "password",
    email: "dwatson@planit.com",
    name: {
      first: "Derek",
      last: "Watson",
    },
  },
  {
    username: "nicoleremy95",
    password: "password",
    email: "nremy@planit.com",
    name: {
      first: "Nicole",
      last: "Remy",
    },
  },
  {
    username: "VinAVarghese",
    password: "password",
    email: "vvarghese@planit.com",
    name: {
      first: "Vincent",
      last: "Varghese",
    },
  },
  {
    username: "Brycetp11",
    password: "password",
    email: "bpingul@planit.com",
    name: {
      first: "Bryce",
      last: "Pingul",
    },
  },
];

const mapSeed = [
  {
    name: "Team Vancouver Trip",
    creatorId: undefined,
    dates: {
      start: new Date("2021-01-20"),
      end: new Date("2021-01-28"),
    },
    destinations: ["Vancouver", "Whistler"],
  },
  {
    name: "Visit Cuba",
    creatorId: undefined,
    dates: {
      start: new Date("2021-03-06"),
      end: new Date("2021-03-20"),
    },
    destinations: ["Cuba"],
  },
];

const suggestionSeed = [
  {
    userId: "",
    mapId: "",
    title: "AirBnb house",
    category: "Accomodation",
    description: "Cool AirBnb with a hottub in Whistler",
    link: "https://www.airbnb.com/rooms/16068259?s=67&unique_share_id=5951f1de-099c-4b12-a013-54df4c947520",
    cost: 175,
  }
]

const chatSeed = [
  {
    userId: "",
    mapId: "",
    message: "Wow, live chat! This is really cool :)",
  },
  {
    userId: "",
    mapId: "",
    message: "I wonder if they made this using socket.io?",
  },
]

const potentialUserSeed = [
  {
    email: "derek.watson92@gmail.com",
    invitedMapIds: [],
  }
]

async function addUsers() {
  // Insert 5 users
  const userPromises = userSeed.map(async user => await models.User.create(user));
  const userDocs = await Promise.all(userPromises);
  // console.log("User docs: ", userDocs);
  // Get user ids
  const userIds = userDocs.map(doc => doc._id);

  return { docs: userDocs, ids: userIds };
}

async function addMaps(users) {
  // Add created user ids to maps
  mapSeed[0].creatorId = users.ids[0];
  mapSeed[0].creator = users.docs[0].username;
  mapSeed[0].guests = users.docs.filter(user => user._id !== users.ids[0]).map(user => user.email);
  mapSeed[1].creatorId = users.ids[1];
  mapSeed[1].creator = users.docs[1].username;


  // Add 2 maps
  const mapDocs = await models.Map.insertMany(mapSeed)
  // console.log("Map docs: ", mapDocs);

  // Get map ids
  const mapIds = mapDocs.map(doc => doc._id);

  // Update sample users with new created maps
  users.docs[0].createdMaps.push(mapIds[0]);
  users.docs[1].createdMaps.push(mapIds[1]);

  // Update other users with guest maps
  users.docs.forEach(user => {
    if (user._id !== users.docs[0]._id) {
      user.guestMaps.push(mapIds[0]);
    }
    if (user._id !== users.docs[1]._id) {
      user.invitations.push(mapIds[1]);
    }
  })
  // Save all users after pushing associated maps
  users.docs.forEach(user => user.save());

  // return map info for outside access
  return { docs: mapDocs, ids: mapIds };
}

async function addSuggestion(users, maps) {
  // Add real ids into suggestion
  suggestionSeed[0].userId = users.ids[0];
  suggestionSeed[0].mapId = maps.ids[0];
  suggestionSeed[0].votes = [
    { userId: users.ids[0], vote: true },
    { userId: users.ids[1], vote: false },
    { userId: users.ids[2], vote: true }
  ];
  suggestionSeed[0].comments = [
    { userId: users.ids[2], message: "Looks really nice!" },
    { userId: users.ids[1], message: "Probably gonna cost way more with fees added :(" }
  ];

  // Create suggestion doc
  const suggestionDoc = await models.Suggestion.create(suggestionSeed[0]);
  suggestionDoc.votes.push({ userId: users.ids[3], vote: false });
  suggestionDoc.save();
  // console.log("Suggestion doc: ", suggestionDoc);

  return suggestionDoc;
}

async function addChats(users, maps) {
  // Add generated id details to chat objects
  chatSeed[0].user = users.ids[4];
  chatSeed[0].map = maps.ids[0];

  chatSeed[1].user = users.ids[4];
  chatSeed[1].map = maps.ids[0];

  const chatDocs = await models.Chat.insertMany(chatSeed);
  // console.log("Chat docs: ", chatDocs);

  return chatDocs;
}

async function addPotentialUsers(maps) {
  potentialUserSeed[0].invitedMapIds.push(maps.ids[0]);
  const potentialUserDocs = await models.PotentialUser.create(potentialUserSeed[0]);
  // console.log("Potential User docs: ", potentialUserDocs);

  return potentialUserDocs;
}

async function seed() {
  const users = await addUsers();
  const maps = await addMaps(users);
  const suggestion = await addSuggestion(users, maps);
  const chats = await addChats(users, maps);
  const potentialUsers = await addPotentialUsers(maps);
};

module.exports = seed;
