const express = require('express');
const mongo = require('mongodb').MongoClient;
let inputData = require('./socketEvents').inputData;
// const socketEvents = require('socketEvents');
//client in brad's
const socket = require('socket.io');

const app = express();

const port = process.env.PORT || 7070;

const server = app.listen(port, () => {
    console.log('Server started on port 7070');
});

app.use(express.static('public'));

const io = socket(server);

mongo.connect('mongodb://127.0.0.1:27017/mongochat', (err, db) => {
    if (err) {
        throw err;
    }
    console.log('Mongo connected');


    io.on('connection', (socket) => {
        let chat = db.collection('chats');

        exports.sendStatus = (status) => {
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

            if (name == '' || message == '') {
                sendStatus('Please enter a name and a message');
            } else {
                chat.insert({
                    name,
                    message
                }, () => {
                    io.emit('output', [param1]);
                    sendStatus({
                        message: 'Message sent'
                    });
                });
            }
        });
    });
});