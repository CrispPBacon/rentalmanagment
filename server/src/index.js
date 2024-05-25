const express = require('express');
const path = require('path');

const { auth, rooms, users } = require('./controllers');
// const { ObjectId } = mongoose.Types

const app = express();
app.use([express.static(path.join(__dirname, "..", '/public')), express.json(), express.urlencoded({extended: true})]);
app.listen(process.env.PORT || 3500, () => console.log("Connected to PORT 3500"));

// REFSTFUL API

app.post('/api/auth', auth);
app.post('/api/rooms', rooms);
app.post('/api/users', users)
