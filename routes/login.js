var express = require('express');
var router = express.Router();
var data = require('../data/data');
/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log('here');
  let artwork_data = await data.getAllArtwork();
  let artwork = [];
  console.log('here');
  artwork_data.artwork.forEach(art =>{
    artwork.push({title: art['art_title'], id: art['art_id']});
  });
  res.render('login', { title: 'BCAVAM', 
                        layout: 'layout',
                        artwork: artwork});
});

module.exports = router;