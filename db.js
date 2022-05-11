function dbConnect() {

const mongoose = require('mongoose')
const port = process.env.PORT || 3000;

const url = 'mongodb://' + port + '/artwork_detail'

mongoose.connect(url, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})

const connection = mongoose.connection
connection.once('open', function() {
    console.log('Database connected...')
}).catch(function(err){
    console.log('Connection failed...')
})
}

module.exports = dbConnect
