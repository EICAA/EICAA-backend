'use strict';

const nodemailer = require('nodemailer');
const { KnownLogicError } = require('../errors');

// TODO implement a real SMTP service here

// FYI: https://nodemailer.com/smtp/
const getSmtpConfig = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return {
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      pass: SMTP_PASS,
    };
  }
};

let transporter = null;

const getTransporter = async () => {
  if (!transporter) {
    const config = getSmtpConfig();

    if (config) {
      const { host, port, user, pass } = config;
      transporter = nodemailer.createTransport({
        pool: true,
        host,
        port,
        secure: false, // for port 587, secure is not possible
        auth: {
          user,
          pass,
          /* tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
          }, */
        },
      });

      console.log('[mailer] transporter configured...');

      try {
        await new Promise((resolve, reject) => {
          transporter.verify((error, success) => {
            if (error) {
              reject(error);
              return;
            } else {
              resolve(success);
            }
          });
        });

        console.log('[mailer] ...and verified successfully.');
      } catch (error) {
        console.log('[mailer] ...failed verification!');
        console.log(error);
      }
    } else {
      throw new KnownLogicError({
        message: 'Missing SMTP config - falling back to console logging minimal info',
      });
    }
  }

  return transporter;
};

const DEFAULT_FROM = {
  name: 'EICAA Digital Platform',
  address: 'noreply@dp.eicaa.eu',
};

const sendEmail = async ({ to, subject, text, html, from = DEFAULT_FROM }, fallbackLogMessage) => {
  try {
    const tr = await getTransporter();

    const sendResult = tr.sendMail({ from, to, subject, text, html });
  } catch (error) {
    if (error instanceof KnownLogicError) {
      console.log(error.message);
      console.log(fallbackLogMessage);
    } else {
      throw error;
    }
  }
};

module.exports = {
  sendEmail,
};
