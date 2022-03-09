var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let artwork = await data.getRow();
  //Sort by last name
  this.artwork = artwork.sort(function (a, b) {
    let name_a = a.art_creator.split(' ')[1];
    console.log(name_a);
    console.log(name_a[1]);
    let name_b = b.art_creator.split(' ')[1];
    return name_a.localeCompare(name_b);
  });
  res.render('credits', { title: 'BCAVMA', 
                          layout: 'layout',
                          artwork: artwork});
});

module.exports = router;