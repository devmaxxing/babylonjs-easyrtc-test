const Datachannel = (() => {

    const CONSTANTS = {
        openListener:   'open',
        closeListener:  'close',
        peerListener:   'peer',
        roomOccupant:   'roomOccupant'
    };

    // NOTE: No time to write a "off" implementation and test for any side effects that happen
    // when removing elements from an array or map while looping through it

    // MEGA ULTRA simple and not thoroughly tested implementation of an observer pattern
    class Observer {
        constructor() {
            this.topics = {};
        }

        on(topic, handler) {
            if (this.topics[topic] == null) {
                // array will contain all the handlers
                this.topics[topic] = [];
            }

            this.topics[topic].push(handler);
        }

        dispatch(topic, event={}) {
            if (topic in this.topics) {
                this.topics[topic].forEach((fn) => {
                    fn(event)
                });
            }
        }
    }

    class Datachannel extends Observer {
        constructor(easyrtc) {
            super()

            this.easyrtc = easyrtc;

            // will be set when connected
            this.easyrtcid = null;

            this.easyrtc.enableDebug(false);
            this.easyrtc.enableDataChannels(true);
            this.easyrtc.enableVideo(false);
            this.easyrtc.enableAudio(false);
            this.easyrtc.enableVideoReceive(false);
            this.easyrtc.enableAudioReceive(false);

            this.addListeners();
        }

        addListeners() {
            this.easyrtc.setDataChannelOpenListener(this.openListener.bind(this));
            this.easyrtc.setDataChannelCloseListener(this.closeListener.bind(this));
            this.easyrtc.setPeerListener(this.addToConversation.bind(this));
            this.easyrtc.setRoomOccupantListener(this.convertListToButtons.bind(this));
        }

        openListener(otherParty) {
            this.dispatch(CONSTANTS.openListener, {data: otherParty})
        }

        closeListener(otherParty) {
            this.dispatch(CONSTANTS.openListener, {data: otherParty})
        }

        addToConversation(who, msgType, content) {
            this.dispatch(CONSTANTS.openListener, {data: {
                who,
                msgType,
                content
            }});
        }

        convertListToButtons(roomName, occupantList, isPrimary) {
            this.dispatch(CONSTANTS.openListener, {data: {
                roomName,
                occupantList,
                isPrimary
            }});
        }

        async connect() {
            
            return new Promise((resolve, reject) => {

                this.easyrtc.connect("easyrtc.dataMessaging",
                
                // login success
                (id) => {
                   this.easyrtcid = id;
                   resolve();
                }),

                // login failure
                (errorCode, message) => {
                    reject(message);
                } 
            });
        }
    }


    return {
        Class: Datachannel,
        CONSTANTS
    };
})();