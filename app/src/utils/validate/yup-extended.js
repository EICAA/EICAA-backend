const Yup = require('yup');
const { convertToDatetime } = require('../datetime');

// Extending Yup (sub)schema prototypes
// https://github.com/jquense/yup/issues/312

Yup.addMethod(Yup.string, 'iso8601ToDatetime', function () {
  return this.transform((value, originalValue, ctx) => {
    if (value) {
      const newValue = convertToDatetime(new Date(value));

      return newValue;
    }
    return value;
  });
});

Yup.addMethod(Yup.date, 'toDatetime', function () {
  return this.transform((value, originalValue, ctx) => {
    if (value) {
      const newValue = value.toISOString().slice(0, 19).replace('T', ' ');

      return newValue;
    }
    return value;
  });
});

module.exports = Yup;
