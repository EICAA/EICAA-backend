const Yup = require('../yup-extended');

const { MySQL } = require('../../constants');
const { Validation } = require('../../errorMessageKeys');

const baseResultFields = {
  id: Yup.number().strip(),
  assessmentId: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .required()
    .max(MySQL.Limits.MAX_UINT4, Validation.Number.TooLarge)
    .min(1, Validation.Number.ShouldBe.Positive),
  start: Yup.string().max(255, Validation.LengthExceeded).iso8601ToDatetime(), // required?
  end: Yup.string().max(255, Validation.LengthExceeded).iso8601ToDatetime(), // required?
  durationSeconds: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_INT4, Validation.Number.TooLarge), // required?
  language: Yup.string().max(255, Validation.LengthExceeded),
  resultToken: Yup.string().max(255, Validation.LengthExceeded),
  feedbackScore: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_INT1, Validation.Number.TooLarge)
    .min(1, Validation.Number.ShouldBe.Positive),
  feedbackText: Yup.string().max(MySQL.Limits.TEXT, Validation.LengthExceeded),
  consentGiven: Yup.boolean()
    .required(Validation.Other.ConsentRequired)
    .oneOf([true], Validation.Other.ConsentRequired),
  requestedRemoval: Yup.boolean().strip(),
  createdAt: Yup.string().strip(),
};

const newEmployeeResultSchema = Yup.object().shape({
  ...baseResultFields,
  // Additional Result fields of employee type Assessment
  country: Yup.string().max(255, Validation.LengthExceeded),
  educationLevel: Yup.string().max(255, Validation.LengthExceeded),
  workExperience: Yup.string().max(255, Validation.LengthExceeded),
  workField: Yup.string().max(255, Validation.LengthExceeded),
  organisationType: Yup.string().max(255, Validation.LengthExceeded),
  organisationSize: Yup.string().max(255, Validation.LengthExceeded),
  levelOfPosition: Yup.string().max(255, Validation.LengthExceeded),
  gender: Yup.string().max(255, Validation.LengthExceeded),
  ageGroup: Yup.string().max(255, Validation.LengthExceeded),
});

const newStudentResultSchema = Yup.object().shape({
  ...baseResultFields,
  // Additional Result fields of student type Assessment
  country: Yup.string().max(255, Validation.LengthExceeded),
  educationLevel: Yup.string().max(255, Validation.LengthExceeded),
  majorField: Yup.string().max(255, Validation.LengthExceeded),
  hasWorkExperience: Yup.string().max(255, Validation.LengthExceeded),
  workExperience: Yup.string().max(255, Validation.LengthExceeded),
  employmentStatus: Yup.string().max(255, Validation.LengthExceeded),
  employmentType: Yup.string().max(255, Validation.LengthExceeded),
  gender: Yup.string().max(255, Validation.LengthExceeded),
  ageGroup: Yup.string().max(255, Validation.LengthExceeded),
});

const updateResultSchema = Yup.object().shape({
  feedbackScore: Yup.number().integer(Validation.Number.ShouldBe.Integer),
  feedbackText: Yup.string().max(MySQL.Limits.TEXT, Validation.LengthExceeded),
  requestedRemoval: Yup.boolean(),
});

const ResultFields = {
  DEMOGRAPHY: {
    employee: [
      'country',
      'educationLevel',
      'workExperience',
      'workField',
      'organisationType',
      'organisationSize',
      'levelOfPosition',
    ],
    student: [
      'country',
      'educationLevel',
      'majorField',
      'hasWorkExperience',
      'workExperience',
      'employmentStatus',
      'employmentType',
    ],
  },
  DEMOGRAPHY_SENSITIVE: ['gender', 'ageGroup', 'educationLevel'],
  MISC: [
    'requestedRemoval',
    'resultToken',
    'feedbackScore',
    'feedbackText',
    'consentGiven',
    'email',
  ],
};

const getSanitizedResult = (result, toOmit = []) => {
  const sanitized = { ...result };

  for (let key of toOmit) {
    delete sanitized[key];
  }

  return sanitized;
};

module.exports = {
  newEmployeeResultSchema,
  newStudentResultSchema,
  updateResultSchema,
  getSanitizedResult,
  ResultFields,
};
