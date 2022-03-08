var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('credits', { title: 'BCAVMA', 
                          layout: 'layout',
                          artwork: await data.getRow()});
});

module.exports = router;