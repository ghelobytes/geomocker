var express = require('express');
var app = express();

var fs = require('fs');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var https = require('https').Server(options, app);
var io = require('socket.io')(https);
var path = require('path');

var geo = {
    currentPosition: {
        coords: {
            latitude: 14.557245789799888,
            longitude: 121.02156530454636,
            accuracy: 100
        }
    },
    error: {
        code: 0,
        NO_ERROR: 0,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
    }
}

global.geo = geo;







app.use(express.static(path.join(__dirname, '.')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/map.html');
});

io.on('connection', function(socket) {
    console.log('new client connected');

    socket.on('request_initial_position', function(data) {
        geo.currentPosition.timestamp = (new Date()).getTime();
        io.emit('set_initial_position', geo.currentPosition);
    });

    socket.on('position_changed', function(data) {
        console.log('position_changed: ', data);
        geo.currentPosition.coords.latitude = data.center.lat;
        geo.currentPosition.coords.longitude = data.center.lng;
        geo.currentPosition.timestamp = (new Date()).getTime();

        if(geo.error.code === geo.error.NO_ERROR)
            io.emit('position_changed', geo.currentPosition);
    });

    socket.on('accuracy_changed', function(data) {
        console.log('accuracy_changed: ', data);
        geo.currentPosition.coords.accuracy = data;
        geo.currentPosition.timestamp = (new Date()).getTime();

        if(geo.error.code === geo.error.NO_ERROR)
            io.emit('accuracy_changed', geo.currentPosition);
    });

    socket.on('error_raised', function(data) {
        console.log('error_raised: ', data);
        geo.error.code = Number(data);
        if(geo.error.code !== geo.error.NO_ERROR)
            io.emit('error_raised', geo.error);
    });

    socket.on('disconnect', function() {
        console.log('client disconnected');
    });
});

https.listen(3000, function() {
    console.log('listening on *:3000');
});
