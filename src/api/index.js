const express = require('express');

const emojis = require('./emojis');
const customData = require('./customData');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API'
  });
});

router.use('/emojis', emojis);
router.use('/custom-data', customData);

module.exports = router;
