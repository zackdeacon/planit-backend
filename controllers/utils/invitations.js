const db = require("../../models");
const nodemailer = require("../../nodemailer");

const inviter = {
  // Check if each guest email already has an acccount
  inviteGuests: async function (inviterInfo) {
    const { tripName, tripId, creatorId, guestEmails } = inviterInfo;

    const creator = await db.User.findById(creatorId);
    const creatorName = creator.name;

    for (let guestEmail of guestEmails) {
      const guestAccounts = await db.User.find({ email: guestEmail });
      const emailInfo = { guestEmail, tripName, creatorName };

      if (guestAccounts.length > 0) {
        emailInfo.isNewUser = false;
        this.sendGuestInvitation(emailInfo);
        guestAccounts.forEach((account) => {
          account.invitations.push(tripId);
          account.save();
        });
      } else {
        emailInfo.isNewUser = true;
        this.sendGuestInvitation(emailInfo);
      }
    }
  },

  // Send a guest an email invitiation
  sendGuestInvitation: function (emailInfo) {
    nodemailer.sendEmail({
      to: emailInfo.guestEmail,
      subject: nodemailer.invitation.subject(emailInfo.creatorName),
      text: nodemailer.invitation.text(emailInfo),
      html: nodemailer.invitation.html(emailInfo),
    }).then(info => {
      console.log(info);
    }).catch(err => {
      console.log(err);
    });
  }
}

module.exports = inviter;