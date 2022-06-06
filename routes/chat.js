var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let art = await data.getArtwork(req.query.room);

  res.render('chat', { title: 'BCAVAM',
                        layout: 'layout',
                        art_source: art['art_source']});
});

module.exports = router;
