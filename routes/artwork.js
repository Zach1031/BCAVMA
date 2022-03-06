const e = require('express');
var express = require('express');
var {google} = require('googleapis')
var router = express.Router();
var data = require('../dummy_data/data');
//var search = require('/javascripts/search');

//var search_library = require('js-search');
// var search_library = new JsSearch.Search();
// search_library.addIndex('art_title');
// search_library.addIndex('art_creator');
// search_library.addIndex('art_type');
//search.addIndex('art_tags');

function loadSorted(array, sortBy){
  var sort = [array.length];

  for(i = 0; i < data.length; i++){
    sort[array.indexOf(data[i][sortBy])] = data[i];
  }

  return sort;
}

function createArray(sortBy){
  var array = [data.length];

  for(i = 0; i < data.length; i++){
    array[i] = data[i][sortBy];
  }

  return array.sort();
}

/* GET home page. */
router.get('/:page_number', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;
  let page_number = req.params.page_number;

  let artwork = await data.getRow({page_number: page_number});

  // console.log(artwork);
  //
  // console.log(artwork);

  if(search){
    let art = artwork.find(function (art) { return art.art_id == search });

    if(!(sort == null)){
      art = loadSorted(createArray(sort), sort);
    }

    res.render('artwork', { title: 'BCAVMA',
          layout: 'layout',
          search: 'search',
          artwork: art,
          previous: parseInt(page_number)-1,
          next: parseInt(page_number)+1,
          page_number: page_number});
  }

  else if (sort){
    console.log(artwork);
    console.log("----------------")
    let art = "";
    if(sort == "art_title"){
      art = artwork.sort(function (a, b) {
        return a.art_title.localeCompare(b.art_title);
      });
    }

    else if(sort == "art_creator"){
      art = artwork.sort(function (a, b) {
        return a.art_creator.localeCompare(b.art_creator);
      });
    }

    console.log(art);
    res.render('artwork', { title: 'BCAVMA',
          layout: 'layout',
          search: 'search',
          artwork: art,
          previous: parseInt(page_number)-1,
          next: parseInt(page_number)+1,
          page_number: page_number});
  }

  else{
    res.render('artwork', { title: 'BCAVMA',
          layout: 'layout',
          search: 'search',
          artwork: artwork,
          previous: parseInt(page_number)-1,
          next: parseInt(page_number)+1,
          page_number: page_number});
  }
  });

  router.get('/', async function(req, res, next) {
    let id = req.query.id;
    let search = req.query.search;
    let sort = req.query.sort;

    if(id){
      if((!(search == null)) || (!(sort == null))){
        next();
      }

      console.log('here');
      console.log(id);
      // let art2 = await data.getRow();
      // // console.log(art2);
      let art = await data.getRow({id: id});
      //let art = artwork.find(function (art) { return art.art_id == id });

      // console.log(art);

      if(art) {
        // console.log(art);
        res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });}

      else{next();}
    }

    else{
      res.redirect('/artwork/1')}
    }
    );





module.exports = router;
