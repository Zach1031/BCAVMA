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

module.exports.getRow = async (data) => {
  


    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    // load the documents info
    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];

    // Get all the rows

    if(data.page_number){
      let pageNumber = data.page_number;
      var jsonObj = [];
      var pageLength = 8;

      var start = pageLength * (pageNumber - 1);
      var end = (pageLength * pageNumber) - 1;
      console.log(start);
      console.log(end);
    
      let rows = await sheet.getRows({offset: start, limit: pageLength});
      let passed = 0;
      //console.log(rows)
      for (let index = 0; index < rows.length; index++) {
          //const row = rows[index]._rawData;
          const row = rows[index];
          console.log(row);
          console.log(row.Valid);



          if(row.Valid === "TRUE"){
            // if (passed >= start && passed <= end) {
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
              item ["row_number"] = row._rowNumber;
              console.log(item);
              jsonObj.push(item);
            // }

            // passed++;
          
          }


      };
      return jsonObj;
    }

    else if (data.id){
      let rows = await sheet.getRows({offset: start, limit: pageLength});
      //console.log(rows)
      for (let index = 0; index < rows.length; index++) {
          //const row = rows[index]._rawData;
          const row = rows[index];



          if(row.Valid === "TRUE" && row.ID == data.id){
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
              item ["row_number"] = row._rowNumber;
              console.log(item);
              return item;
          }

          return null;


      };
    }
};

module.exports.getArtwork = async (id) => {

  

};

    // {
    //     art_title: "Starry Night",
    //     art_creator: "Vincent Van Goh",
    //     art_description: "In creating this image of the night sky—dominated by the bright moon at right and Venus at center left—van Gogh heralded modern painting’s new embrace of mood, expression, symbol, and sentiment. Inspired by the view from his window at the Saint-Paul-de-Mausole asylum in Saint-Rémy, in southern France, where the artist spent twelve months in 1889–90 seeking reprieve from his mental illnesses, The Starry Night (made in mid-June) is both an exercise in observation and a clear departure from it. The vision took place at night, yet the painting, among hundreds of artworks van Gogh made that year, was created in several sessions during the day, under entirely different atmospheric conditions. The picturesque village nestled below the hills was based on other views—it could not be seen from his window—and the cypress at left appears much closer than it was. And although certain features of the sky have been reconstructed as observed, the artist altered celestial shapes and added a sense of glow.",
    //     art_source: "/images/Starry Night.jpg",
    //     art_id: "1234",
    //     art_type: "Video"
    // },
    //
    // {
    //     art_title: "Scream",
    //     art_creator: "Edward Munch",
    //     art_description: "The Scream is the popular name given to a composition created by Norwegian artist Edvard Munch in 1893. The agonized face in the painting has become one of the most iconic images of art, seen as symbolizing the anxiety of the human condition. Munch's work, including The Scream, would go on to have a formative influence on the Expressionist movement. Munch recalled that he had been out for a walk at sunset when suddenly the setting sun's light turned the clouds a blood red. He sensed an infinite scream passing through nature. Scholars have located the spot to a fjord overlooking Oslo and have suggested other explanations for the unnaturally orange sky, ranging from the effects of a volcanic eruption to a psychological reaction by Munch to his sister’s commitment at a nearby lunatic asylum.",
    //     art_source: "/images/Scream.jpg",
    //     art_id: "2345"
    // },
    //
    // {
    //     art_title: "Idk what this is called",
    //     art_creator: "I have no idea",
    //     art_description: "Some picture I found on the internet",
    //     art_source: "/images/Picture.jpg",
    //     art_id: "3456"
    // }