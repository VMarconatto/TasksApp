require('dotenv').config()
const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY
const usermail = process.env.USER_EMAIL

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:usermail,
        subject:'Thanks for joining in!',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

module.exports = sendWelcomeEmail