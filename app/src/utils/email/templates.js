'use strict';

const RESET_PASSWORD = {
  subject: 'Password reset requested',
  text:
    'Hello ::firstName::lastName,\n\nYou can use the link below to reset your password:\n' +
    `${process.env.FRONTEND_APP_URL}/user/reset-password?token=::resetPasswordToken\n\n` +
    'Greetings from:\nEICAA Digital Platform',
  // html: `<html>` + `</html>`,
};

const ADMIN_ACCESS = {
  subject: 'Administrator access',
  text:
    'Hello admin (::email),\n\nYou can use the data below to make admin requests:\n' +
    'Request urls:\n' +
    'POST /admin/get-data\n' +
    'BODY to include field:\n' +
    'jwt: ::jwt\n\n' +
    'Greetings from:\nEICAA Digital Platform',
};

const createResetPasswordWithUrlMessage = ({ resetPasswordToken, firstName, lastName }) => {
  let text = RESET_PASSWORD.text.replace('::resetPasswordToken', resetPasswordToken);
  if (!firstName && !lastName) {
    text = text.replace('::firstName', 'EICAA Digital Platform User').replace('::lastName', '');
  } else {
    text = text
      .replace('::firstName', firstName)
      .replace('::lastName', lastName ? ` ${lastName}` : '');
  }

  return {
    subject: RESET_PASSWORD.subject,
    text,
  };
};

const createAdminAccessInfoMessage = ({ email, jwt }) => {
  const text = ADMIN_ACCESS.text.replace('::email', email).replace('::jwt', jwt);

  return {
    subject: ADMIN_ACCESS.subject,
    text,
  };
};

module.exports = {
  createResetPasswordWithUrlMessage,
  createAdminAccessInfoMessage,
};
