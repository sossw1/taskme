import 'dotenv/config';
import sgMail from '@sendgrid/mail';

const sendgridAPIKey = process.env.SENDGRID_API_KEY;
const from = 'sossw1@gmail.com';

if (sendgridAPIKey) {
  sgMail.setApiKey(sendgridAPIKey);
}

export const sendWelcomeEmail = (name: string, email: string): void => {
  sgMail.send({
    to: email,
    from,
    subject: 'Welcome to Taskme',
    text: `Hi there!\n\nThanks for signing up, ${name}! We hope you enjoy using our application. Please let us know if you need any assistance!\n\n-The Taskme Team`
  });
};

module.exports = {
  sendWelcomeEmail
};
