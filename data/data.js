const { GoogleSpreadsheet } = require('google-spreadsheet');
var {google} = require('googleapis');
// File handling package
const fs = require('fs');
const { INSPECT_MAX_BYTES } = require('buffer');
const RESPONSES_SHEET_ID = '1VEIONwFJ0TQzdLZX41bddhHmM1eNxbRyCiBP2KaYNZA';


const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
// Credentials for the service account
const CREDENTIALS = JSON.parse(fs.readFileSync('./credentials.json'));

const getServerSide = async() => {
  const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']});
  const sheets = google.sheets({ version: 'v4', auth });
}

function formatTags(tags){
  return (tags.trim()).split(',');
}

function containsID(jsonObj, ID){
  let contains = false;
  jsonObj.forEach(artwork => {
    if(artwork['art_id'] === ID){
      contains = true;
    }
  });

  return contains;
}

sortByCriteria = async (artworkList, criteria) => {
  let returnArtwork;
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

  return returnArtwork;
}

function containsTag(tag, tag_list){
  tag = (tag.toLowerCase()).trim();
  let returnVale = false;

  for(i = 0; i < tag_list.length; i++){
    if(tag === (tag_list[i].toLowerCase()).trim()){
      return true;
    }
  }

  return returnVale;
}

module.exports.getAllArtwork = async (data) => {
    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    // load the documents info
    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];
    let tags = [];
    let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

    let rows = await sheet.getRows();
    let jsonObj = [];
    for (let index = 0; index < rows.length; index++) {
        var row = rows[index];
        if(row.Valid === "TRUE"){
            item = {};
            item ["art_title"] = row.Artwork_Name;
            item ["art_creator"] = row.Artist_Name;
            item ["art_description"] = row.Description;;
            artsourcelink = row.Upload_Artwork;
            baseUrl = "https://drive.google.com/uc?id";
            imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
            url = baseUrl.concat(imageId);
            item ["art_source"] = url;
            item ["art_id"] = row.ID;
            item ["art_type"] = row.Media_Format;
            item ["art_tags"] = formatTags(row.Tags);
            item["art_tags"].forEach(function (tag){
            if(!containsTag(tag, tags)){
                tags.push(tag);
            }
            });
            item ["row_number"] = row._rowNumber;

            if(!(containsID(jsonObj, row.ID))){
              jsonObj.push(item);
            }
        }

    };
    return {artwork: jsonObj, tags: tags};
};

module.exports.getArtwork = async (id) => {
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key
  });

// load the documents info
  await doc.loadInfo();

  let sheet = doc.sheetsByIndex[0];
  let tags = [];
  let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

  let rows = await sheet.getRows();
  let jsonObj = [];
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if(row.Valid === "TRUE"){
      if(row.ID === id){
        item = {};
        item ["art_title"] = row.Artwork_Name;
        item ["art_creator"] = row.Artist_Name;
        item ["art_description"] = row.Description;;
        // item ["art_source"] = row.Upload_Artwork;
        //test other source of art
        artsourcelink = row.Upload_Artwork;
        baseUrl = "https://drive.google.com/uc?id";
        imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
        url = baseUrl.concat(imageId);
        item ["art_source"] = url;
        item ["art_id"] = row.ID;
        item ["art_type"] = row.Media_Format;
        item ["art_tags"] = formatTags(row.Tags);
        item ["row_number"] = row._rowNumber;

        return item;
      }
    }
  };
  
  return null;
}