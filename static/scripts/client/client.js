class Client {
    constructor(easyrtc, room, datachannel, mediaContainer) {
        // model will be defined when app is ready so that we can get an id
        this.model = null;
        this.easyrtc = easyrtc;
        this.room = room;
        this.datachannel = datachannel;

        if (room == null) {
            this.room ="default";
        }
        this.mediaContainer = mediaContainer;
        this.connectedPeers = new Set();
        this.peerCallback = ()=>{};
    }

    async init() {
        console.log('Initializing client...');
        this.easyrtc.enableDataChannels(true);
        this.easyrtc.setPeerListener((easyrtcid, msgType, msgData, targeting) => {
            this.peerCallback(msgType, msgData);
        });
        this.easyrtc.setDataChannelOpenListener((easyrtcid) => {
            this.connectedPeers.add(easyrtcid);
        });
        this.easyrtc.setDataChannelCloseListener((easyrtcid) => {
            this.connectedPeers.delete(easyrtcid);
        });
        this.easyrtc.setRoomOccupantListener((roomName, userList, selfInfo) => {
            for (let occupant of Object.keys(userList)) {
                console.log("Establishing call with client " + occupant);
                this.easyrtc.call(occupant, 
                    (otherCaller, mediaType) => {
                        console.log("Call established with client " + otherCaller);
                    }, (errorCode, errMessage) => {
                        console.error(`${errorCode + ": " + errMessage}`);
                    }, null);
            }
            this.easyrtc.setRoomOccupantListener(null);
        });
        
        this.easyrtc.setStreamAcceptor((easyrtcid, stream) => {
            console.log("Added new audio stream");
            const newMediaElem = document.createElement("video");
            this.mediaContainer.appendChild(newMediaElem);
            newMediaElem.id = "stream-" + easyrtcid;
            this.easyrtc.setVideoObjectSrc(newMediaElem,stream);
        });

        this.easyrtc.setOnStreamClosed(function(easyrtcid, stream, streamName) {
            const item = document.getElementById("stream-" + easyrtcid);
            item.parentNode.removeChild(item);
        });

        this.easyrtc.setAcceptChecker(function(easyrtcid, callback) {
            callback(true);
        });

        this.easyrtc.enableVideo(false);
        this.easyrtc.enableVideoReceive(false);
        
        this.easyrtc.initMediaSource(() => {
            console.log("Initialized media source.");
            this.easyrtc.connect("BabylonTest",
                (easyrtcId, roomOwner) => {
                    this.appReady(easyrtcId);
                    console.log("Successfully connected to app. Joining room " + this.room);
                    this.easyrtc.joinRoom(this.room, null, (room) => {
                        console.log("Connected to room " + room);
                    }, (errorCode, errorText, roomName) => {
                        console.error("Failed to join room " + roomName);
                        console.error(`${errorCode + ": " + errorText}`);
                    });
                },
                (errorCode, errorText) => {
                    console.error(`${errorCode + ": " + errorText}`);
                }
            );
        },
        (errorCode, errorText) => {
            console.error(`${errorCode + ": " + errorText}`);
        });

        // TODO refactor and resolve conflicts
        // init datachannel wrapper
        // try {
        //     await this.datachannel.connect();
        //     console.log('initialized datachannel')
        // }
        // catch (err) {
        //     console.log("Error while trying to init datachannel")
        //     console.err(err)
        // }
    }

    setPeerCallback(fn) {
        this.peerCallback = fn;
    }

    broadcastEvent(eventName, data) {
        for (let peer of this.connectedPeers) {
            this.easyrtc.sendDataP2P(peer, eventName, data);
        }
    }

    appReady(appId) {
        this.model = new Models.Client(appId);
        console.log(`Client ${appId} up and running`);
        console.log(this.model);
    }
}