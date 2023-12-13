const MySQL = {
  Limits: {
    MAX_UINT4: 4294967295,
    MAX_INT4: 2147483647,
    MAX_INT1: 127,
    CHAR: 255,
    TEXT: 32767, // Half, because having Unicode 2 byte chars
  },
};

module.exports = {
  MySQL,
};
