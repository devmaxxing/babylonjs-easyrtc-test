// A shape is an graphical object that contains coordiates
// and can be moved
class Object3d {

    constructor(id, mesh={}) {
        this.id = id;
        this.mesh = mesh;
    }

    getMesh() {
        return this.mesh;
    }
}

// Key and Door are graphical objects
class Key extends Object3dModel{}
class Door extends Object3dModel{}
class Person extends Object3dModel{}

// A client is a web client that renders the game.
// Each client will keep track of the door and key coordinates
class Client {
    constructor(id) {

        if (id == null) {
            throw new Error("id param needs to be defined");
        }

        this.id = id;

        // can contain any kind of Object3d
        this.Objects = new Map();

        // add key
        let key = new Key('key')
        this.addObject(key.id, key);

        // add door
        let door = new Door('door');
        this.addObject(door.id, door);

        // person
        let person = new Person('person');
        this.addObject(person.id, person);
    }

    addObject(object3d) {
        if (!this.Objects.has(object3d.id)) {
            this.Objects.set(object3d);
        }
    }

    removeObject(object3d) {
        if (this.Objects.has(object3d.id)) {
            this.Objects.remove(object3d.id);
        }
    }
}




module.exports = {
    Object3d,
    Client
};