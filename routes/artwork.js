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

function generateKeyWords(artwork){
  keywords = [];
  artwork.forEach(art => {
    art.keywords = []
    art.keywords.push(art.art_creator);
    art.keywords.push(art.art_title);
    art.art_tags.forEach(tag => art.keywords.push(tag));
  });


  return artwork;
}

/* GET home page. */
router.get('/:page_number', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;
  let tags = req.query.tags;
  let page_number = parseInt(req.params.page_number);


  let artwork;

  // Determine if the work to be displayed in rendered based on search query or page number
  if (tags){
    artwork = await data.getRow();
    tags = tags.split('+');
    let temp_list = [];

    //This is horrible code, could def be improved
    // for(i = 0; i < artwork.length; i++){
    //   let art = artwork[i];
    //   console.log(art);
    //   let include_tags = false;
    //   for(j = 0; j < art.art_tags.length; j++){
    //     console.log(art.art_tags[j]);
    //     if(tags.includes(art.art_tags[j])){
    //       console.log(art.art_tags[j]);
    //       include_tags = true;
    //     }
    //   }
    //   if(include_tags){
    //     temp_list.push(artwork[i]);
    //   }
    // }

    for(i = 0; i < artwork.length; i++){
      let art = artwork[i];
      art.art_tags.forEach(function(tag) {
        if(tags.includes((tag.toLowerCase()).trim())){
          temp_list.push(art);
        }
      });
    }
    artwork = temp_list;
  }

  if(search){
    if(!(artwork)){
      artwork = await data.getRow()
    };
    // all_artwork = generateKeyWords(all_artwork);
    const fuse = new Fuse(artwork, options);
    artwork = formatSearch(fuse.search(search))
    
  }

  

  if(!(search) && !(tags)){artwork = await data.getRow({page_number: page_number});}

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


// Once the result is searched for, filtered, and sorted, it's paginated
  // if((page_number - 1) * 8 > artwork.length){
  //   next();
  //   return;
  // }
  // artwork = artwork.slice(page_number - 1, page_number * 8);
  // res.render('artwork', { title: 'BCAVMA',
  //       layout: 'layout',
  //       search: 'search',
  //       artwork: artwork,
  //       previous: page_number !== 1 ? page_number - 1 : null,
  //       next: artwork.length == 8 ? page_number + 1 : null,
  // page_number: page_number});
  // });
  artwork = artwork.slice(page_number - 1, page_number * 8);
  res.render('artwork', { title: 'BCAVMA',
        layout: 'layout',
        search: 'search',
        artwork: artwork,
        previous: page_number - 1 ,
        next: page_number + 1,
  page_number: page_number});
  });

router.get('/', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;

  if(id){
    if((!(search == null)) || (!(sort == null))){next();}

    let art = await data.getRow({id: id});

    console.log(art.art_tags);

    if(art) {res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art, tags: art.art_tags });}
    else{next();}
  }

  else{
    res.redirect('/artwork/1')
  }
});





module.exports = router;
