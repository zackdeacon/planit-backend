// const models = require("../models");

// // This file empties the Books collection and inserts the books below

// const userSeed = [
//   {
//     username: "zackdeacon",
//     password: "password",
//     email: "zdeacon@planit.com",
//     name: {
//       first: "Zack",
//       last: "Deacon",
//     },
//   },
//   {
//     username: "derek-watson14",
//     password: "password",
//     email: "dwatson@planit.com",
//     name: {
//       first: "Derek",
//       last: "Watson",
//     },
//   },
//   {
//     username: "nicoleremy95",
//     password: "password",
//     email: "nremy@planit.com",
//     name: {
//       first: "Nicole",
//       last: "Remy",
//     },
//   },
//   {
//     username: "VinAVarghese",
//     password: "password",
//     email: "vvarghese@planit.com",
//     name: {
//       first: "Vincent",
//       last: "Varghese",
//     },
//   },
//   {
//     username: "brycepingul",
//     password: "password",
//     email: "bpingul@planit.com",
//     name: {
//       first: "Bryce",
//       last: "Pingul",
//     },
//   },
// ];

// const mapSeed = [
//   {
//     name: "Team Vancouver Trip",
//     creator: undefined,
//     admins: [],
//     dates: {
//       start: new Date("2021-01-20"),
//       end: new Date("2021-01-28"),
//     },
//     destinations: ["Vancouver", "Whistler"],
//     suggestionCategories: [
//       {name: "Accomodation", oneChoice: true},
//       {name: "Flights", oneChoice: true},
//       {name: "Food", oneChoice: false},
//       {name: "Entertainment", oneChoice: false},
//     ],
//   },
//   {
//     name: "Visit Cuba",
//     creator: undefined,
//     admins: [],
//     dates: {
//       start: new Date("2021-03-06"),
//       end: new Date("2021-03-20"),
//     },
//     destinations: ["Cuba"],
//     suggestionCategories: [
//       {name: "Accomodation", oneChoice: true},
//       {name: "Flights", oneChoice: true},
//       {name: "Food", oneChoice: false},
//       {name: "Entertainment", oneChoice: false},
//     ],
//   },
// ];

// const suggestionSeed = [
//   {
//     author: "",
//     map: "",
//     title: "AirBnb house",
//     category: "Accomodation",
//     description: "Cool AirBnb with a hottub in Whistler",
//     link: "https://www.airbnb.com/rooms/16068259?s=67&unique_share_id=5951f1de-099c-4b12-a013-54df4c947520",
//     cost: 175,
//   }
// ]

// const chatSeed = [
//   {
//     author: "",
//     map: "",
//     message: "Wow, live chat! This is really cool :)",
//   },
//   {
//     author: "",
//     map: "",
//     message: "I wonder if they made this using socket.io?",
//   },
// ]

// // TODO: rewrite this without using callback functions
// // TODO: rewrite seeds using API calls when routes are done
// function seed() {
//   // Insert 5 users
//   models.User.insertMany(userSeed, function(error, userDocs) {
//     console.log("Users insert error: ", error);
//     console.log("User docs: ", userDocs);
//     // Get user ids
//     const userIds = userDocs.map(doc => doc._id);
//     // Set userId stuff for maps
//     mapSeed[0].creator = userIds[0];
//     mapSeed[0].admins = [userIds[0]];
//     mapSeed[0].guests = userIds.filter(id => id !== userIds[0]);

//     mapSeed[1].creator = userIds[1];
//     mapSeed[1].admins = [userIds[1]];

//     models.Map.insertMany(mapSeed, function(error, mapDocs) {
//       console.log("Maps insert error: ", error);
//       console.log("Map docs: ", mapDocs);
//       // get map ids
//       const mapIds = mapDocs.map(doc => doc._id);

//       // Update users with associated maps
//       userDocs[0].createdMaps.push(mapIds[0]);
//       userDocs.forEach(user => {
//         if (user._id !== userDocs[0]._id) {
//           user.guestMaps.push(mapIds[0]);
//         }
//       })
//       userDocs[1].createdMaps.push(mapIds[1]);
//       // Save all users after pushing associated maps
//       userDocs.forEach(user => user.save());

//       // Add stuff to suggestion object
//       suggestionSeed[0].author = userIds[0];
//       suggestionSeed[0].map = mapIds[0];
//       suggestionSeed[0].votes = [
//         {userId: userIds[0], vote: true}, 
//         {userId: userIds[1], vote: false}, 
//         {userId: userIds[2], vote: true}
//       ];
//       suggestionSeed[0].comments = [
//         {userId: userIds[2], message: "Looks really nice!"}, 
//         {userId: userIds[1], message: "Probably gonna cost way more with fees added :("}
//       ];

//       // Create suggestion and add suggestion id to corresponding map
//       models.Suggestion.create(suggestionSeed[0], function(error, suggestionDoc) {
//         console.log("Suggestion insert error: ", error);
//         console.log("Suggestion doc: ", suggestionDoc);
//         // Add suggestion id to map
//         mapDocs[0].suggestions.push(suggestionDoc._id);
//       });

//       // Set chat author and maps with real ids
//       chatSeed[0].author = userIds[4];
//       chatSeed[0].map = mapIds[0];

//       chatSeed[1].author = userIds[4];
//       chatSeed[1].map = mapIds[0];

//       // Insert chats and add chat ids to corresponding map
//       models.Chat.insertMany(chatSeed, function(error, chatDocs) {
//         console.log("Chat insert error: ", error);
//         console.log("Chat docs: ", chatDocs);
//         const chatIds = chatDocs.map(chat => chat._id);

//         mapDocs[0].chats.push(...chatIds);
//       })

//       // Save updates from chat and suggestion add in map
//       mapDocs[0].save();
//     })
//   });
// }

// // ! Will seed:
// // 5 Users
// // 2 Maps - map 1 with 4 guests
// // 1 suggestion on map 1
// // 2 chats on map 1

// module.exports = seed;