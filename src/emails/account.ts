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

export const sendCancellationEmail = (name: string, email: string): void => {
  sgMail.send({
    to: email,
    from,
    subject: 'Taskme Cancellation',
    text: `Hi ${name},\n\nWe're sorry to see you go. If you have a moment, we would like your feedback in order to improve future experiences for other users. If you could send us a reply to let us know about your experience and what you would like to see improved, that would be greatly appreciated. Thank you for your time!\n\n-The Taskme Team`
  });
};
