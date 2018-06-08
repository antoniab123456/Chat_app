const express = require('express');
const mongo = require('mongodb').MongoClient;
const socket = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const methodOverRide = require('method-override');

const app = express();

app.use(bodyParser.json());
app.use(methodOverRide('_method'));
const port = process.env.PORT || 7070;

const time = new Date();
const server = app.listen(port, () => {
    console.log(`Server started ${port} on the ${time}`);
});



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/index');
app.use('/', routes);

const io = socket(server);


const mongoFunction = (err, db) => {

    if (err) {
        throw err;
    }

    io.on('connection', (socket) => {

        console.log(`connected ${socket.id}`);
       
        socket.on('disconnect', () =>{
            socket.disconnect(true);
            console.log('disconnected');
        });

        let chat = db.collection('chats');

        let sendStatus = (status) => {
            socket.emit('status', status);
        }

        chat.find().limit(100).sort({
            _id: 1
        }).toArray((err, res) => {
            if (err) {
                throw err;
            }
            socket.emit('output', res);
        });

        socket.on('input', (data) => {
            let name = data.name;
            let message = data.message;
            let hours = data.hours;
            let mins = data.mins;


            if (name == '' || message == '') {
                sendStatus('Please enter a name and a message');
            } else {
                chat.insert({
                    name: name,
                    message: message,
                    hours: hours,
                    mins: mins
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

mongoose.set('debug', true);

let conn = mongoose.createConnection('mongodb://localhost:27017/mongochat', mongoFunction);

let gfs;

conn.once('open', () => {
   gfs = Grid(conn.db, mongoose.mongo);
   gfs.collection('uploads');
});

