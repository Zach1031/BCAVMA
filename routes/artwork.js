const e = require('express');
var express = require('express');
var {google} = require('googleapis')
var router = express.Router();
var data = require('../data/data');

// Set up search
const Fuse = require('fuse.js');
const { composer } = require('googleapis/build/src/apis/composer');
const options = {
  isCaseSensitive: false,
  shouldSort: true,
  threshold: 0.3,
  keys: [
    {
      name: "art_title",
      weight: 2
    },
    "art_creator",
    "art_tags"
  ]
};

//Search returns additional information in the json, so it needs to be formatted
function formatSearch(search_result){
  jsonObj = [];
  search_result.forEach(function (item){
    jsonObj.push(item.item);
  });
  return jsonObj;
}

function isNumeric(page_number){
  for(i = 0; i < page_number.length; i++){
    if(page_number.charCodeAt(i) > 57 || page_number.charCodeAt(i) < 48){
      return false;
    }
  }

  return true;
}

function sortByCriteria (artworkList, criteria) {
  let returnArtwork;
  console.log(artworkList);
  if(criteria === "art_title"){
    returnArtwork = artworkList.sort(function (a, b) {
    return a.art_title.localeCompare(b.art_title);
    });
  }

  else if(criteria === "art_creator"){
    returnArtwork = artworkList.sort(function (a, b) {
    return a.art_creator.localeCompare(b.art_creator);
    });
  }

  console.log(returnArtwork);
  return returnArtwork;
}

function overlappingTags(tags1, tags2){
  for(i = 0; i < tags1.length; i++){
    for(j = 0; j < tags2.length; j++){
      if((tags1[i].toLowerCase()).trim() === (tags2[j].toLowerCase()).trim()){
        console.log('here');
        return true;
      }
    }
  }

  return false;
}

/* GET home page. */
router.get('/:page_number', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;
  let tags = req.query.tags;

  if(!isNumeric(req.params.page_number)){
    next(); return;
  }

  let page_number = parseInt(req.params.page_number);


  let artwork_data = await data.getAllArtwork();
  let artwork = artwork_data.artwork;
  let tag_list = artwork_data.tags;

  if(search){
    const fuse = new Fuse(artwork, options);
    artwork = formatSearch(fuse.search(search));
  }

  if(sort){
    if(sort !== 'art_title' && sort !== 'art_creator'){
      next(); return;
    }

    artwork = sortByCriteria(artwork, sort);
  }

  if(tags){
    tags = tags.split('+');
    let temp_artwork = [];
    artwork.forEach(art => {
      if(overlappingTags(art['art_tags'], tags)){
        temp_artwork.push(art);
      }
    });

    artwork = temp_artwork;
  }

  if((page_number - 1) * 8 > artwork.length){
    next(); return;
  }

  let artwork_length = artwork.length;
  artwork = artwork.slice((page_number - 1) * 8, page_number * 8);

  res.render('artwork', { title: 'BCAVMA',
        layout: 'layout',
        search: 'search',
        artwork: artwork,
        previous: page_number !== 1 ? page_number - 1 : null,
        next: (page_number + 1) * 8 < artwork_length ? page_number + 1 : null,
        page_number: page_number,
        tags: tag_list
    });
});

router.get('/', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;

  if(id){
    if((!(search == null)) || (!(sort == null))){next(); return;}

    let art = await data.getArtwork(id);

    if(art) {res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art, tags: art['art_tags'] });}
    else{next();}
  }

  else{
    res.redirect('/artwork/1');
  }
});





module.exports = router;
