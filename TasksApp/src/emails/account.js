const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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 '

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'viniciusmarconatto@hotmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

module.exports = sendWelcomeEmail