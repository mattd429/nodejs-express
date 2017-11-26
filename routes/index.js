var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/inventory'); // redirect our index to inventory.js 
});

module.exports = router;
