const e = require('express');
var express = require('express');
var {google} = require('googleapis')
var router = express.Router();
var data = require('../dummy_data/data');

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
router.get('/', function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;
  let art = null;

  res.send(data);

  if(!(id == null)){
    art = data.find(function (art) { return art.art_id == id });
    if(art){
      res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });
    }
    else {next();}
  }

  else if (!(search == null)){
    // art = search_library.search(search);
  }

  else {art = data;}

  res.render('artwork', { title: 'BCAVMA',
          layout: 'layout',
          search: 'search',
          artwork: art});
  }



  // if(!(id == null)){
  //   if((!(search == null)) || (!(sort == null))){
  //     next();
  //   }
  //   let art = data.find(function (art) { return art.art_id == id });


  //   if (art === undefined) {
  //     next();
  //   }
  //   else {
  //     res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });
  //   }
  // }

  // else if(!(search == null)){
  //   let art = data.find(function (art) { return art.art_id == search });

  //   if(!(sort == null)){
  //     art = loadSorted(createArray(sort), sort);
  //   }


  //   if (art === undefined) {
  //     next();
  //   }
  //   else{
  //     res.render('artwork', { title: 'BCAVMA', layout: 'layout', search: 'search', artwork: {art}});
  //   }
  // }

  // else {
  //   if(!(sort == null)){
  //     let art = loadSorted(createArray(sort), sort);

  //     res.render('artwork', { title: 'BCAVMA',
  //        layout: 'layout',
  //        search: 'search',
  //        artwork: art});
  //   }

  //   else {

  //     res.render('artwork', { title: 'BCAVMA',
  //       layout: 'layout',
  //       search: 'search',
  //       artwork: data});
  //   }
  // }


);


module.exports = router;
