'use strict';

module.exports = {
  API: {
    401: '401',
    403: '403',
    404: '404',
    500: '500',
  },
  Controller: {
    MissingAssessment: '',
  },
  Validation: {
    FieldRequired: 'field.required',
    LengthExceeded: 'field.length-exceeded',
    Date: {
      CannotEndBeforeStart: 'field.date.cannot-end-before-start',
    },
    Number: {
      ShouldBe: {
        Integer: 'field.number.should-be.integer',
        Positive: 'field.number.should-be.positive',
        NotNegative: 'field.number.should-be.not-negative',
      },
      TooLarge: 'field.number.too-large',
    },
    Other: {
      ConsentRequired: 'other.consent-required',
    },
  },
};
