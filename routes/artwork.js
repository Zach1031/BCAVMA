var express = require('express');
var router = express.Router();
var data = require('../dummy_data/data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('artwork', { title: 'BCAVMA', 
                        layout: 'layout',
                        artwork: data});
});

router.get('/:art_id', function(req, res, next) {
  let art_id = req.params.art_id;

  // Find matching event in the data (a real database will be easier to query)
  let art = data.find(function (art) { return art.art_id == art_id });


  if (art === undefined) {
    next(); //pass along to other handlers (send 404)
  }
  else {
    res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });
  }
});

module.exports = router;
