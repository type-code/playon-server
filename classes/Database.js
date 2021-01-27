var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

class Database {
    constructor() {
        var host = config.db_host;
        var user = config.db_user;
        var pass = config.db_pass;
        var port = config.db_port;
        var name = config.db_name;

        this.db = null;
        this.url = `mongodb://${host}:${port}/${name}`;
        this.ObjectID = ObjectID;
    }

    connect(Socket) {
        MongoClient.connect(this.url, (e, db) => {
            if (e) Logger.DatabaseFalse();

            Logger.DatabaseTrue();
            this.db = db;
            Socket.db = this;
            
            db.collection("oldrooms").find({}).toArray((e, rooms) => {
                for(var a in rooms) {
                    Socket.room_create(rooms[a].name, rooms[a].video);
                }
            });
        });
    }

    room_refresh(room) {
        this.db.collection("oldrooms").update({name: room.room}, {
            $set: {
                video: room.video,
                users: room.users.length
            }
        }, (e, r) => {
            if (!e) room.changed = false;
        });
    }

    get conn() {
        return this.db;
    }
}

module.exports = Database;