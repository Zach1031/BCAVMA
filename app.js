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

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var artworkRouter = require('./routes/artwork');
var aboutRouter = require('./routes/about');
var creditsRouter = require('./routes/credits');
var loginRouter = require('./routes/login');
var launchRouter = require('./routes/loadUnity');
var submitRouter = require('./routes/submission');
var chatRouter = require('./routes/chat');
// var jsonRouter = require('./routes/json');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

const botName = 'Gallery Hall';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Gallery Hall!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});
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
app.use('/chat',chatRouter);
// app.use('/json',jsonRouter);


var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {;});

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
