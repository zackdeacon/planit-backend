const nodemailer = require("nodemailer");

const TEAM_EMAIL_ADDRESS = 'teamplanitcartographers@gmail.com';
const PLANIT_URL = "https://travelplanit.herokuapp.com";

let messageOptions= {  
    from: TEAM_EMAIL_ADDRESS,
        to: "zackdeacon347@gmail.com",
        subject: `${data.data.name} Trip`,
        text: "",
      html: `
        <img src=""./assets/logos/txt_green.png""
        <h1 style="margin-bottom: 25px; font-size: 1.25rem;">${data.data.name}</h1>
        <p style="margin-bottom: 15px;">
          Here is the final itinerary for ${data.data.name}! We hope you have a fantastic trip and thanks for letting us help you Planit!
        </p>
        <row>
        <div>
        <h3>Accomodations</h3>

        </div>
        <div>
        <h3>Flights</h3>

        </div>
        <div>
        <h3>Food</h3>

        </div>
        <div>
        <h3>Entertainment</h3>

        </div>

        </row>

        <p>Make sure you say thanks to ${data.data.creatorId.name.first} for planning this great trip!</p>
      `}

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'teamplanitcartographers@gmail.com',
          pass: 'planitpassword1'
        }
      });
  transporter.sendMail(messageOptions, (err, info)=> {
    if (err) {
      return console.log(err)
    } else {
      console.log("message sent: %s", info.message)
    }
  });
  


