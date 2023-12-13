const Yup = require('../yup-extended');

const { Validation } = require('../../errorMessageKeys');

const newCdkSchema = Yup.object().shape({
  id: Yup.number().strip(),
  jsonId: Yup.number().integer(Validation.Number.ShouldBe.Integer),
  cdkType: Yup.string().max(255, Validation.LengthExceeded),
  name: Yup.string().max(255, Validation.LengthExceeded),
  area: Yup.string().max(255, Validation.LengthExceeded),
  competence: Yup.string().max(255, Validation.LengthExceeded),
  difficulty: Yup.string().max(255, Validation.LengthExceeded),
  lastCreated: Yup.string().max(255, Validation.LengthExceeded),
});

module.exports = {
  newCdkSchema,
};
