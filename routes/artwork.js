const e = require('express');
var express = require('express');
var {google} = require('googleapis')
var router = express.Router();
var data = require('../dummy_data/data');
const Fuse = require('fuse.js');

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

function searchValue(keywords, data){
  //console.log(keywor)
  const options = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: ['art_title', 'art_creator', 'art_type']
  }
  console.log('here1');
  
  const search_fuse = new Fuse.Fuse(data, options);
  console.log('here2');
  const result = search_fuse.search(keywords);
  console.log('here3');
  console.log(result);
  console.log('here4');
  return result;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;
  let art = null;

  //res.send(data);

  if(!(id == null)){
    art = data.find(function (art) { return art.art_id == id });
    if(art){
      res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });
    }
    else {next();}
  }

  else if (!(search == null)){
    search.searchValue(search, data);
    res.render('artwork', { title: 'BCAVMA',
          layout: 'layout',
          search: 'search',
          artwork: data});
    
  }

  else {
    res.render('artwork', { title: 'BCAVMA',
          layout: 'layout',
          search: 'search',
          artwork: data});
    
  }
});


module.exports = router;
