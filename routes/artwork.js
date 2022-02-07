var express = require('express');
var router = express.Router();
var data = require('../dummy_data/data');

/* GET home page. */
router.get('/', function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;

  if(!(id == null)){
    let art = data.find(function (art) { return art.art_id == id });


    if (art === undefined) {
      next(); 
    }
    else {
      res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });
    }
  }

  else if(!(search == null)){
    let art = data.find(function (art) { return art.art_id == search });


    if (art === undefined) {
      next(); 
    }
    else {
      res.render('artwork', { title: 'BCAVMA', layout: 'layout', search: 'search', artwork: {art}});
    }
  }

  else {
    res.render('artwork', { title: 'BCAVMA', 
    layout: 'layout',
    search: 'search',
    artwork: data});
  }
  
});

router.get('/page/:page_number', function(req, res, next) {
  let page_number = req.params.page_number;
  if((page_number - 1) * 4 > (data.length)){
    next();

  }
  else{

    let artwork_segment = data.slice(((page_number-1) * 4), ((page_number*4)-1));

    console.log(artwork_segment);
    
    for(let x in artwork_segmenet){
      console.log("test");
    }

    if(page_number >= 3){
      pages = {previous: (page_number - 1), first: (page_number - 1), second: (page_number), third: (page_number + 1), next: (page_number - 1)};
    }
    else{
      pages = {previous: 1, first: 1, second: 2, third: 3, next: 2};
    }
    
    res.render('artwork_page', { title: 'BCAVMA', 
                          layout: 'layout',
                          artwork: artwork_segment,
                          pages: pages});
  }
  
  
});

router.get('/:art_id', function(req, res, next) {
  let art_id = req.params.art_id;

  let art = data.find(function (art) { return art.art_id == art_id });


  if (art === undefined) {
    next(); 
  }
  else {
    res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art });
  }
});

router.get('/search', function(req, res, next) {
  let keyword = req.query.keyword;
  res.send(keyword);
  //search data base for results
});

module.exports = router;
