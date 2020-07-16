
// class that contains x, y and z coordinates
class Coordinates {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// A shape is an graphical object that contains coordiates
// and can be moved
class Shape extends Coordinates {

    constructor(coords=new Coordinates()) {
        super(coords.x, coords.y, coords.z);
    }

    // @param coords Coordinates
    update(coords) {

        if (coords.x != null) {
            this.x = coords.x;
        }

        if (coords.y != null) {
            this.y = coords.y;
        }

        if (coords.z != null) {
            this.z = coords.z;
        }
    }
}

// Key and Door are graphical objects
class Key extends Shape{}
class Door extends Shape{}

// A client is a web client that renders the game.
// Each client will keep track of the door and key coordinates
class Client {
    constructor(id) {

        if (id == null) {
            throw new Error("id param needs to be defined");
        }

        this.key = new Key(keyCoords);
        this.door = new Door(doorCoords);
        this.id = id;
    }

}

// A Room is a game room that can contain many clients
// and holds the coordinates to the door and key
// We can add and remove clients
class Room {
    constructor(doorCoords, keyCoords) {
        this.key = new Key(keyCoords);
        this.door = new Door(doorCoords);
        this.clients = new Map();
    }

     // returns bool
     addClient(client) {
        let added = false;

        if (!this.clients.has(client.id)) {
            this.clients.set(client.id, client);
            added = true;
        }

        return added;
    }

    // returns bool
    removeClient(id) {
        let removed = false;
    
        if (this.clients.has(id)) {
            this.clients.delete(id);
            removed = true;
        }

        return removed;
    }
}

// A game session can be considered like the server that hosts an n number of rooms
class GameSession {
    constructor(id, room) {

        if (id == null) {
            throw new Error("id param needs to be defined");
        }
        
        this.maxRooms = 2
        this.room = room;
        this.id = id;
    }


    // returns bool
    addRoom(room) {

        if (this.rooms.size() >= this.maxRooms) {
            return false
        }

        let added = false;

        if (!this.rooms.has(room.id)) {
            this.rooms.set(room.id, room);
            added = true;
        }

        return added;
    }

    // returns bool
    removeRoom(id) {
        let removed = false;
    
        if (this.rooms.has(id)) {
            this.rooms.delete(id);
            removed = true;
        }

        return removed;
    }
}

const gs = new GameSession(123);
const r = new Room(321);
const key = new Key();
const door = new Door();

console.dir(new GameSession(123));


module.exports = {
    Client,
    GameSession,
    Key,
    Room
};