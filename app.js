const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const exphbs  = require('express-handlebars');

//Initialize express
const app = express();

//BodyParser middleware
app.use(bodyParser.json());

//MethodOverride middleware
app.use(methodOverride('_method'));

//Basic Expres-server setup
const port = process.env.PORT || 7070;

const time = new Date();
const server = app.listen(port, () => {
    console.log(`Server started ${port} at ${time.getHours()+':'+time.getMinutes()}`);
});

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//Static folder setup
app.use(express.static(path.join(__dirname, 'public')));

//Initialize socket.io server
const io = socket(server);

//Socket and mongoDB setup 
const mongoFunction = (err, db) => {

    if (err) throw err;

    io.on('connection', (socket) => {
        socket.on('disconnect', () =>{
            socket.disconnect();
            console.log('disconnected');
        });

        let chat = db.collection('chats');

        let sendStatus = (status) => {
            socket.emit('status', status);
        }

        chat.find().limit(100).sort({
            _id: 1
        }).toArray((err, res) => {
            if (err) { throw err; }
            socket.emit('output', res);
        });

        socket.on('input', (data) => {
            
            let name = data.name;
            let message = data.message;
            let hours = data.hours;
            let mins = data.mins;/* 
            let image = data.image; */
        

            if (name == '' || message == '') {
                sendStatus('Please enter a name and a message');
            } else {
                chat.insert({
                    name: name,
                    message: message,
                    hours: hours,
                    mins: mins/* ,
                    image: image */
                }, () => {
                    io.sockets.emit('output', [data]);
                    sendStatus({
                        message: 'Sent',
                        clear: true
                    });
                });
            }
        });
    });
}

//Setup mongoose(mongodb) connection

mongoose.set('debug', true);

let mongoURL = 'mongodb://localhost:27017/mongochat';

//Execute mongoFunc when the connection is established
let conn = mongoose.createConnection(mongoURL, mongoFunction);


//GridFs collection Setup 

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//Gfs functions to use in the uploads_controller 

exports.getFiles = (cb) => {
    gfs.files.find().toArray(cb);
}

exports.getFilename = (param, cb) => {
    gfs.files.findOne(param, cb);
}

exports.readStream = (file_name, response) => {
    let readstream = gfs.createReadStream(file_name);
    readstream.pipe(response);
}

//Setup routes
const routes = require('./routes/index');
app.use('/', routes);




