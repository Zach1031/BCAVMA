var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { GoogleSpreadsheet } = require('google-spreadsheet');
var {google} = require('googleapis');
// File handling package
const fs = require('fs');
const RESPONSES_SHEET_ID = '1VEIONwFJ0TQzdLZX41bddhHmM1eNxbRyCiBP2KaYNZA';


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var artworkRouter = require('./routes/artwork');
var aboutRouter = require('./routes/about');
var creditsRouter = require('./routes/credits');
var loginRouter = require('./routes/login');
var launchRouter = require('./routes/loadUnity');
var submitRouter = require('./routes/submission');
// var jsonRouter = require('./routes/json');
var app = express();

// test logs for artwork requests
// const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
// // Credentials for the service account
// const CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json'));
//
// const getServerSide = async() => {
//   const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']});
//   const sheets = google.sheets({ version: 'v4', auth });
// }
//
// const getRow = async () => {
//
//     // use service account creds
//     await doc.useServiceAccountAuth({
//         client_email: CREDENTIALS.client_email,
//         private_key: CREDENTIALS.private_key
//     });
//
//     // load the documents info
//     await doc.loadInfo();
//
//     let sheet = doc.sheetsByIndex[0];
//
//     // Get all the rows
//     let rows = await sheet.getRows();
//     for (let index = 0; index < rows.length; index++) {
//         const row = rows[index];
//
//         // const x = Boolean(row.Valid);
//         // console.log(x);
//         if(row.Valid === "TRUE"){
//
//           console.log(row.Artwork_Name);
//           console.log(row.ID);
//           console.log(row.Timestamp);
//           console.log(row.Artist_Name);
//           console.log(row.Description);
//           console.log(row.Tags);
//           console.log(row.Upload_Artwork);
//         }
//
//
//     };
// };
// getRow();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/artwork', artworkRouter);
app.use('/about', aboutRouter);
app.use('/credits', creditsRouter);
app.use('/login', loginRouter);
app.use('/loadUnity',launchRouter);
app.use('/submission',submitRouter);
// app.use('/json',jsonRouter);


var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {;});
hbs.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.get("/json",function(req,res){
  res.json({"message":"hello"});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
