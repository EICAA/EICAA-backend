const Yup = require('../yup-extended');

const { MySQL } = require('../../constants');
const { Validation } = require('../../errorMessageKeys');

const numberRating = Yup.number()
  .integer(Validation.Number.ShouldBe.Integer)
  .max(MySQL.Limits.MAX_INT1, Validation.Number.TooLarge)
  .min(1, Validation.Number.ShouldBe.Positive);

const ratingShape = {
  id: Yup.number().strip(),
  userId: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_UINT4, Validation.Number.TooLarge)
    .min(1, Validation.Number.ShouldBe.Positive),
  cdkId: Yup.number()
    .integer(Validation.Number.ShouldBe.Integer)
    .max(MySQL.Limits.MAX_UINT4, Validation.Number.TooLarge)
    .min(1, Validation.Number.ShouldBe.Positive),
  helpfulness: numberRating,
  trainingResults: numberRating,
  easeOfUse: numberRating,
  interactivity: numberRating,
};

const newRatingSchema = Yup.object().shape(ratingShape);

const ratingUpdateSchema = Yup.object().shape(
  Object.assign({}, { ...ratingShape, userId: ratingShape.userId.strip() }),
);

module.exports = {
  newRatingSchema,
  ratingUpdateSchema,
};
