var express = require('express');
var router = express.Router();
var data = require('../dummy_data/data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('artwork', { title: 'BCAVMA', 
                        layout: 'layout',
                        artwork: data});
});

module.exports = router;
