const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");

const { Schema } = mongoose;
const filePath = path.join(__dirname, '..', '..', '..','config.json');

// const ObjectId = mongoose.Types.ObjectId;

function readJsonFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        try {
            const config = JSON.parse(data);
            callback(null, config);
        } catch(err) {
            callback(err, null);
        }
    });
}

function handleResult(err, config) {
    if (err) {
        console.error("Error reading JSON file:", err);
        return;
    }
    connect(config);
}


async function connect(config) {
    const url = config.db_host;
    try {
        await mongoose.connect(url);
        console.log(`MongoDB Connected!`);
    } catch(err) {
        console.error("Connection Error", err);
        process.exit(1);
    }
    const connectionDb = mongoose.connection;
    connectionDb.once("open", (_)=> console.log(`Connected to ${url}`));
    connectionDb.on("error", (err) => console.log(`ERROR Connecting on mongodb`, err));
}

readJsonFile(filePath, handleResult);

const userSchema = mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    isAdmin: Boolean
}, {versionKey: false})

const roomSchema = new Schema({
    room: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    date_started: { type: Date, default: null },
    date_due: { type: Date, default: null },
  }, { versionKey: false });

const usersCollection = mongoose.model('users', userSchema);
const roomsCollection = mongoose.model('rooms', roomSchema);

module.exports = { usersCollection, roomsCollection }