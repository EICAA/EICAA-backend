const { set, sub } = require('date-fns');

const getEarlierDate = (date, days, startAtMidnight = true) => {
  let earlier = sub(date, { days });

  if (startAtMidnight) {
    earlier = set(earlier, {
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  }
  return earlier;
};

// Misc

const convertToDatetime = (date) => {
  const newValue = date.toISOString().slice(0, 19).replace('T', ' ');

  return newValue;
};

module.exports = {
  getEarlierDate,
  convertToDatetime,
};
