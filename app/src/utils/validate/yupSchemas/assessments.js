const Yup = require('../yup-extended');

const { MySQL } = require('../../constants');
const { Validation } = require('../../errorMessageKeys');

const baseAssessmentFields = {
  id: Yup.number().strip(),
  userId: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_UINT4, Validation.Number.TooLarge)
    .min(1, Validation.Number.ShouldBe.Positive),
  assessmentType: Yup.string().required().max(255, Validation.LengthExceeded), // student, employee
  hash: Yup.string().required().max(255, Validation.LengthExceeded),
  name: Yup.string().required().max(255, Validation.LengthExceeded),
  country: Yup.string().required().max(255, Validation.LengthExceeded),
  availableLanguages: Yup.string().max(255, Validation.LengthExceeded),
  emailRequired: Yup.boolean().default(false),
  demographics: Yup.boolean().default(true),
  shareResults: Yup.boolean().default(false),
  activeFrom: Yup.date().when('activeTo', {
    is: (val) => !!val,
    then: (schema) => schema.max(Yup.ref('activeTo'), Validation.Date.CannotEndBeforeStart),
  }),
  activeTo: Yup.date().nullable(true),
  maxParticipants: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_INT4, Validation.Number.TooLarge),
};

const newAssessmentSchema = Yup.object().shape({
  ...baseAssessmentFields,
  archived: Yup.boolean().strip(),
  participants: Yup.number().strip(),
});

const importedAssessmentSchema = Yup.object().shape({
  ...baseAssessmentFields,
  archived: Yup.boolean(),
  participants: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_UINT4, Validation.Number.TooLarge),
});

const assessmentUpdateSchema = Yup.object().shape({
  archived: Yup.boolean(),
  activeFrom: Yup.date().when('activeTo', {
    is: (val) => !!val,
    then: (schema) => schema.max(Yup.ref('activeTo'), Validation.Date.CannotEndBeforeStart),
  }),
  activeTo: Yup.date().nullable(true),
  maxParticipants: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_INT4, Validation.Number.TooLarge),
});

module.exports = {
  newAssessmentSchema,
  importedAssessmentSchema,
  assessmentUpdateSchema,
};
