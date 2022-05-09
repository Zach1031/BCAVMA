var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let artworkData = await data.getAllArtwork();
  let artwork = artworkData.artwork;
  //Sort by last name
  this.artwork = artwork.sort(function (a, b) {
    let name_a = a.art_creator.split(' ')[1];
    let name_b = b.art_creator.split(' ')[1];
    return name_a.localeCompare(name_b);
  });

  let names = [];

  for (i = 0; i < artwork.length; i++){
    if(!(names.indexOf(artwork[i].art_creator) + 1)){
      names.push(artwork[i].art_creator);
    }
  }

  res.render('credits', { title: 'BCAVMA', 
                          layout: 'layout',
                          names: names});
});

module.exports = router;