class Client {
    constructor(easyrtc) {

        // model will be defined when app is ready so that we can get an id
        this.model = null;
        this.easyrtc = easyrtc;
    }

    init() {
        console.log('Initializing client...')
        this.easyrtc.easyApp("Company_chat_line", "self", ['caller'], this.appReady.bind(this));
    }

    appReady(appId) {
        this.model = new Models.Client(appId);
        console.log(`Client ${appId} up and running`);
        console.log(this.model);
    }

    addListeners() {
        this.easyrtc.setRoomOccupantListener(this.loggedInListener.bind(this))
    }

    loggedInListener() {
        console.log(123)
    }
}

window.addEventListener('load', async () => {
    const client = new Client(easyrtc);
    await client.init()
});