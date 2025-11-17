const express = require('express');
const router = express.Router();

router.get('/sample', (req, res) => {
  res.json({ message: 'Sample route working!' });
});

module.exports = router;