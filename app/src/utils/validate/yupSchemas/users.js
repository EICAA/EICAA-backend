const Yup = require('yup');

const { Validation } = require('../../errorMessageKeys');

const newUserSchema = Yup.object().shape({
  id: Yup.number().strip(),
  email: Yup.string().required().max(255, Validation.LengthExceeded),
  password: Yup.string().required().max(255, Validation.LengthExceeded),
  firstName: Yup.string().max(255, Validation.LengthExceeded),
  lastName: Yup.string().max(255, Validation.LengthExceeded),
  country: Yup.string().max(255, Validation.LengthExceeded),
  organization: Yup.string().max(255, Validation.LengthExceeded),
  role: Yup.string().max(255, Validation.LengthExceeded),
  position: Yup.string().max(255, Validation.LengthExceeded),
  consentGiven: Yup.boolean()
    .required(Validation.Other.ConsentRequired)
    .oneOf([true], Validation.Other.ConsentRequired),
});

const modifiedUserSchema = Yup.object().shape({
  id: Yup.number().strip(),
  email: Yup.string().required().max(255, Validation.LengthExceeded),
  password: Yup.string().strip(),
  firstName: Yup.string().max(255, Validation.LengthExceeded),
  lastName: Yup.string().max(255, Validation.LengthExceeded),
  country: Yup.string().max(255, Validation.LengthExceeded),
  organization: Yup.string().max(255, Validation.LengthExceeded),
  role: Yup.string().max(255, Validation.LengthExceeded),
  position: Yup.string().max(255, Validation.LengthExceeded),
});

const modifiedUserPasswordSchema = Yup.object().shape({
  id: Yup.number().strip(),
  password: Yup.string().required().max(255, Validation.LengthExceeded),
});

const getSanitizedUser = (user) => {
  const { password, resetPasswordToken, ...sanitized } = user;

  return sanitized;
};

module.exports = {
  newUserSchema,
  modifiedUserSchema,
  modifiedUserPasswordSchema,
  getSanitizedUser,
};
