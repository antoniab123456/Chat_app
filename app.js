const express = require('express');
const mongo = require('mongodb').MongoClient;
const socket = require('socket.io');
const path = require('path');

const app = express();

const port = process.env.PORT || 7070;

const server = app.listen(port, () => {
    console.log('Server started on port 7070');
});

const io = socket(server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/index');
app.use('/', routes);



mongo.connect('mongodb://127.0.0.1/mongochat', (err, db) => {
    if (err) {
        throw err;
    }

    io.on('connection', (socket) => {
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
                    io.emit('output', [data]);
                    sendStatus({
                        message: 'Sent',
                        clear: true
                    });
                });
            }
        });
    });
});