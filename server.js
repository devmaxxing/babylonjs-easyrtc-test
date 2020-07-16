// Load required modules
const http    = require("http");              // http server core module
const express = require("express");           // web framework external module
const bodyParser = require("body-parser");
const serveStatic = require('serve-static');  // serve static files
const socketIo = require("socket.io");        // web socket external module
const easyrtc = require("open-easyrtc"); // EasyRTC

const rooms = new Set();
let rtcApp;

// Set process name
process.title = "node-easyrtc";

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
const app = express();

app.use(serveStatic('static', {'index': ['index.html']}));

app.use(bodyParser.json());
app.post('/rooms', (req, res) => {
    console.log(req.body);
    rtcApp.createRoom(req.body.name, null, (err, obj) => {
        if (err) {
            console.err(err);
        }
        res.json(req.body);
    });
});

app.get('/rooms', (req, res) => {
    rtcApp.getRoomNames((err, roomNames) => {
        res.json({
            rooms: roomNames
        });
    });
});

// Start Express http server on port 8080
const webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
const socketServer = socketIo.listen(webServer, {"log level":1});

easyrtc.setOption("logLevel", "debug");

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");
    rtcRef.createApp("BabylonTest",null, function(err, appObj){
        console.log("App Created!");
        rtcApp = appObj;
    });

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);
        rooms.add(roomName);
        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

// Listen on port 8080
webServer.listen(8080, function () {
    console.log('listening on http://localhost:8080');
});