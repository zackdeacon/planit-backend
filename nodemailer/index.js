const nodemailer = require("nodemailer");
require('dotenv').config();

const TEAM_EMAIL_ADDRESS = 'teamplanitcartographers@gmail.com';
const PLANIT_URL = "https://travelplanit.herokuapp.com/#loginform";

//Create Transporter 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teamplanitcartographers@gmail.com',
    // ! NEED THIS FOR TESTING
    // pass: process.env.NODEMAILER
    pass: "planitpassword1"
  }
});

const mailer = {
  sendEmail: async (options) => {
    options.from = TEAM_EMAIL_ADDRESS;
    return await transporter.sendMail(options);
  },
  invitation: {
    subject: ({ first, last }) => {
      return `${first} ${last} has invited you to help plan a trip with PLANiT!`;
    },
    text: ({ tripName, creatorName, isNewUser }) => {
      const instructions = isNewUser
        ? "signing up for an account"
        : "logging into your account";
      return `
        ${tripName}\n\n
        Help ${creatorName.first} plan this trip by visiting ${PLANIT_URL} and ${instructions}. You will then be able to view the trip itinerary, suggest ideas, vote on suggestions and chat with other people on the trip!\n
        See you there!
      `;
    },
    html: ({ tripName, creatorName, isNewUser }) => {
      const instructions = isNewUser
        ? "signing up for an account"
        : "logging into your account";

      return `
        <h1 style="margin-bottom: 25px; font-size: 1.25rem;">${tripName}</h1>
        <p style="margin-bottom: 15px;">
          Help ${creatorName.first} plan this trip by visiting <a href="${PLANIT_URL}">PLANiT</a> and ${instructions}.
        </p>
        <p style="margin-bottom: 15px;">Then you can: </p>
        <ul style="list-style: none; margin-left: 0; padding-left: 1em; text-indent: -1em;">
         <li>✅ View the trip itinerary</li>
         <li>✅ Suggest ideas</li>
         <li>✅ Vote on suggestions</li>
         <li>✅ Chat with others in the group</li>
        </ul>

        <p>See you there!</p>
      `;
    }
  },
  finalRender: {
    email: (data) => {
      // const guestList = data.guests.map(guest => guest)
      //   console.log(guestList)
      return data.guests
    },
    subject: (map) => {
      return `Your trip plan for ${map.name}!`;
    },
    text: (data) => {
      // console.log(data);
      const suggestionList = data.suggestions.map(sugg => `- ${sugg.title}\n`).join();
      return `
        We are going to ${data.map.destinations[0]}!\n
        Text body goes here for email clients without HTML support.\n
        ${suggestionList}
      `
    },
    html: (data) => {
      const accomodationArr = [];
      const flightArr = [];
      const foodArr = [];
      const entertainmentArr = [];
      const otherArr = [];
      console.log(data.suggestions)
      for (let i = 0; i < data.suggestions.length; i++) {
        if (data.suggestions[i].category === "Accommodation") {
          accomodationArr.push(data.suggestions[i])
        }
        else if (data.suggestions[i].category === "Flights") {
          flightArr.push(data.suggestions[i])
        }
        else if (data.suggestions[i].category === "Food") {
          foodArr.push(data.suggestions[i])
        }
        else if (data.suggestions[i].category === "Entertainment") {
          entertainmentArr.push(data.suggestions[i])
        }
        else {
          otherArr.push(data.suggestions[i])
        }

      }
      console.log("here is the array!")
      console.log(accomodationArr)
      const accomodationList = accomodationArr.map(place => `<li key=${place._id}>${place.title} --- $${place.cost} \n <a href=${place.link}>Link</a> </li>`)
      const flightList = flightArr.map(flight => `<li key=${flight._id}>${flight.title} --- $${flight.cost} \n <a href=${flight.link}>Link</a></li>`)
      const foodList = foodArr.map(food => `<li key=${food._id}>${food.title} --- $${food.cost} \n <a href=${food.link}>Link</a></li>`)
      const entertainmentList = entertainmentArr.map(fun => `<li key=${fun._id}>${fun.title} --- $${fun.cost} \n <a href=${fun.link}>Link</a></li>`)
      const otherList = otherArr.map(other => `<li key=${other._id}>${other.title} --- $${other.cost} \n <a href=${other.link}>Link</a></li>`)

      return `
      <body>
      <h1 style="margin-bottom: 25px; font-size: 1.25rem;">${data.map.name}</h1>
      <p style="margin-bottom: 15px;">
        Here is the final itinerary for ${data.map.name}! We hope you have a fantastic trip and thanks for letting us help you Planit!
      </p>
      <row>
      <div>
      <h3>Accomodations</h3>
      <ul>
      ${accomodationList}
      </ul>
      </div>
      <div>
      <h3>Flights</h3>
      <ul>
      ${flightList}
      </ul>
      </div>
      <div>
      <h3>Food</h3>
      <ul>
      ${foodList}
      </ul>
      </div>
      <div>
      <h3>Entertainment</h3>
      <ul>
      ${entertainmentList}
      </ul>
      </div>
      <div>
      <h3>Other</h3>
      <ul>
      ${otherList}
      </ul>
      </div>
      </row>

      <p>Make sure you say thanks to ${data.map.creator} for planning this great trip!</p>
      
      <p>Best, </p>
      <p>Team PLANiT</p>

      </body>
    `;
    }
  },
  passwordReset: {
    subject: (username) => {
      return `Instructions to reset PLANiT password for ${username}`;
    },
    text: ({ username, name, tempPass }) => {
      return `
        Hello ${name.first},\n\n
        We have recieved a request to reset your password on PLANiT, the collaborative travel planning application.\n
        Please use the following password to log into your account with the username ${username}:\n
        ${tempPass}\n
        While you can continue using this password permenantly, we suggest you immediately visit your user page, go to your settings,
        and change it to a personalized password. That way your account's current password is not stored in plain text.\n
        As always, thank you for using PLANiT!\n\n
        Sincerely,\n
        Your PLANiT Team
      `
    },
    html: ({ username, name, tempPass }) => {
      return `
        <h3>Hell0 ${name.first}, </h3>
        <p>We have recieved a request to reset your password on PLANiT, the collaborative travel planning application.</p>
        <p>Please use the following password to log into your account with the username ${username}:</p>
        <h5>${tempPass}</h5>
        <p>While you can continue using this password permenantly, we suggest you immediately visit your user page, go to your settings,
        and change it to a personalized password. That way your account's current password is not stored in plain text.</p>
        <p>As always, thank you for using PLANiT!</p>
        <p>Sincerely,</p>
        <br>
        <h5>Your PLANiT Team</h5>
      `
    }
  }
}

module.exports = mailer;
