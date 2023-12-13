const express = require('express');

const router = express.Router({ mergeParams: true });

router.use(
  express.static('./public', {
    maxAge: '30d',
  }),
);

module.exports = router;
