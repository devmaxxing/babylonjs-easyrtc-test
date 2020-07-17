class Client {
    constructor(easyrtc, room, audio, datachannel) {
        // model will be defined when app is ready so that we can get an id
        this.model = null;
        this.easyrtc = easyrtc;
        this.room = room;
        this.datachannel = datachannel;

        if (room == null) {
            this.room ="default";
        }
        this.audio = audio;
    }

    async init() {
        console.log('Initializing client...');
        this.easyrtc.setStreamAcceptor((_easyrtcid, stream) => {
            console.log("Setting audio stream");
            this.easyrtc.setVideoObjectSrc(this.audio,stream);
        });
        this.easyrtc.enableVideo(false);
        this.easyrtc.enableVideoReceive(false);
        this.easyrtc.initMediaSource(() => {
            console.log("Initialized media source. Connecting to app...");
        },
        (errorCode, errorText) => {
            console.error(`${errorCode + ": " + errorText}`);
        });
        this.easyrtc.connect("BabylonTest",
            () => {
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

        // init datachannel wrapper
        try {
            await this.datachannel.connect();
            console.log('initialized datachannel')
        }
        catch (err) {
            console.log("Error while trying to init datachannel")
            console.err(err)
        }
    }

    appReady(appId) {
        this.model = new Models.Client(appId);
        console.log(`Client ${appId} up and running`);
        console.log(this.model);
    }

    addListeners() {
        this.easyrtc.setRoomOccupantListener(this.loggedInListener.bind(this));
    }

    loggedInListener() {
        console.log(123);
    }
}