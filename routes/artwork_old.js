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

function isNumeric(page_number){
  for(i = 0; i < page_number.length; i++){
    if(page_number.charCodeAt(i) > 57 || page_number.charCodeAt(i) < 48){
      return false;
    }
  }

  return true;
}

function stripWhiteSpace(string){
  for(i = 0; i < string.length; i++){
    if(!(string.charAt(i) == ' ')){
      return (string.substring(i)).toLowerCase();
    }
  }
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


  let artwork_data;
  let artwork;
  let next_page;

  console.log(sort);

  if(sort && (sort !== 'art_title' && sort !== 'art_creator')){
    next(); return;
  }

  // Determine if the work to be displayed in rendered based on search query or page number
  if (tags){
    if(sort){
      artwork_data = await data.getRow({sort: sort});
    }

    else{
      artwork_data = await data.getRow();
    }
    
    if(!artwork_data){
      next(); return;
    }
    artwork = artwork_data.artwork;
    tags = tags.split('+');
    let temp_list = [];

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
      if(sort){
        artwork_data = await data.getRow({sort: sort});
      }
  
      else{
        artwork_data = await data.getRow();
      }
      if(!artwork_data){
        next(); return;
      }
      artwork = artwork_data.artwork;
    };
    const fuse = new Fuse(artwork, options);
    artwork = formatSearch(fuse.search(search))
    
  }

  

  if(!(search) && !(tags)){
    if(sort){
      artwork_data = await data.getRow({sort: sort, page_number: page_number});
    }

    else{
      artwork_data = await data.getRow({page_number: page_number});
    }
    if(!artwork_data){
        next(); return;
      }
    artwork = artwork_data.artwork;
  }

  // If a sort is requested apply it
  // There's probably a cleaner way to do it
  // if (sort){
  //   if(sort == "art_title"){
  //     this.artwork = artwork.sort(function (a, b) {
  //       return a.art_title.localeCompare(b.art_title);
  //     });
  //   }

  //   else if(sort == "art_creator"){
  //     this.artwork = artwork.sort(function (a, b) {
  //       return a.art_creator.localeCompare(b.art_creator);
  //     });
  //   }
  // }


  //Need to see if you go out of bounds
  if(!artwork){
    next(); return;
  }

  tag_info = [];



  artwork_data.tags.forEach(tag =>{
    tag_info.push({'name': tag, 'check': (tags && tags.includes(stripWhiteSpace(tag)))});
    
  });

  res.render('artwork', { title: 'BCAVMA',
        layout: 'layout',
        search: 'search',
        artwork: artwork,
        previous: page_number !== 1 ? page_number - 1 : null,
        next: artwork_data.next_page ? page_number + 1 : null,
        page_number: page_number,
        tags: tag_info
    });
});

router.get('/', async function(req, res, next) {
  let id = req.query.id;
  let search = req.query.search;
  let sort = req.query.sort;

  if(id){
    if((!(search == null)) || (!(sort == null))){next();}

    let art = await data.getRow({id: id});

    console.log(art.art_tags);

    

    art_tags_list = [];

    art.art_tags.forEach(tag => {
      art_tags_list.push(tag.toLowerCase());
    });

    console.log(art_tags_list);

    if(art) {res.render('artwork_detail', { title: art.art_title, styles: ["tables", "event"], art: art, tags: art_tags_list });}
    else{next();}
  }

  else{
    res.redirect('/artwork/1');
  }
});





module.exports = router;
