const { sendEmail } = require('./nodemailer');
const { createAdminAccessInfoMessage, createResetPasswordWithUrlMessage } = require('./templates');

const sendResetPasswordUrl = async ({ email, firstName, lastName }, resetPasswordToken) => {
  const fallbackLogMessage = `[email] for user: ${email}, reason: password reset requested`; //reset password token is: ${resetPasswordToken}

  const { subject, text, html } = createResetPasswordWithUrlMessage({
    resetPasswordToken,
    firstName,
    lastName,
  });

  await sendEmail({ to: email, subject, text, html }, fallbackLogMessage);
};

const sendAdminAccessInfo = async ({ email, jwt }) => {
  const fallbackLogMessage = `[email] for whitelisted admin: ${email}, reason: data access requested`;

  const { subject, text } = createAdminAccessInfoMessage({
    email,
    jwt,
  });

  await sendEmail({ to: email, subject, text }, fallbackLogMessage);
};

module.exports = {
  sendResetPasswordUrl,
  sendAdminAccessInfo,
};
