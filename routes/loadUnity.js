var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('loadUnity', { title: 'BCAVMA', 
                        layout: 'layout'});
});

module.exports = router;s