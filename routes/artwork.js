const e = require('express');
var express = require('express');
var {google} = require('googleapis')
var router = express.Router();
var data = require('../dummy_data/data');

// Set up search
const Fuse = require('fuse.js');
const options = {
  isCaseSensitive: false,
  shouldSort: true,
  threshold: 0.5,
  keys: [
    {
      name: "art_title",
      weight: 2
    },
    "art_creator"
  ]
};

//Search returns additional information in the json, so it needs to be formatted
function formatSearch(search_result){
  console.log(search_result);
  jsonObj = [];
  search_result.forEach(function (item){
    jsonObj.push(item.item);
  });
  return jsonObj;
}

/* GET home page. */
router.get('/:page_number', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;
  let page_number = req.params.page_number;

  let artwork = [];

  // Determine if the work to be displayed in rendered based on search query or page number
  if(search){
    let all_artwork = await data.getRow();
    const fuse = new Fuse(all_artwork, options);

    artwork = formatSearch(fuse.search(search));
  }

  else{artwork = await data.getRow({page_number: page_number});}

  // If a sort is requested apply it
  // There's probably a cleaner way to do it
  if (sort){
    if(sort == "art_title"){
      this.artwork = artwork.sort(function (a, b) {
        return a.art_title.localeCompare(b.art_title);
      });
    }

    else if(sort == "art_creator"){
      this.artwork = artwork.sort(function (a, b) {
        return a.art_creator.localeCompare(b.art_creator);
      });
    }
  }

// Once the result is searched for, paginated, and sorted, it's rendered
  res.render('artwork', { title: 'BCAVMA',
        layout: 'layout',
        search: 'search',
        artwork: artwork,
        previous: parseInt(page_number)-1,
        next: parseInt(page_number)+1,
  page_number: page_number});
  });

router.get('/', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;

  if(id){
    if((!(search == null)) || (!(sort == null))){next();}

    let art = await data.getRow({id: id});

    if(art) {res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });}
    else{next();}
  }

  else{
    res.redirect('/artwork/1')
  }
});





module.exports = router;
