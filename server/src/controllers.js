const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { usersCollection, roomsCollection } = require("./config/db");

const auth =  async(req, res) => {
    const signup = req.body.signup;
    const login = req.body.login;
    const checkLogin = req.body.checkLogin;

    if (signup) {
        const {firstname, lastname, email, username, password, confirmPassword} = signup;
        
        for (let key in signup) {
            if (!signup[key]) {
                return res.json({error: key + " Field empty!"});
            }
        }

        const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
        if (!(nameRegex.test(firstname) && nameRegex.test(lastname))) {
            return res.json({error: "Please enter a valid name!"});
        }
        const userExist = await usersCollection.findOne({username: username});
        const emailExist = await usersCollection.findOne({email: email});
        if (emailExist) {
            return res.json({error: "That email alraedy exist!"});
        }
        if (userExist) {
            return res.json({error: "That username alraedy exist!"});
        }
        
        if (password !== confirmPassword) {
            return res.json({error: "Password do not match!"})
        }

        const newUser = new usersCollection({ fullname: `${firstname.toUpperCase()} ${lastname.toUpperCase()}`, email: email.toLowerCase(), username: username.toLowerCase(), password:password, isAdmin: false });

        try {
            await newUser.save();
            console.log("New user has been created!");
            return res.json({success: "User created successfully!"});
        } catch (err) {
            console.log("Error creating user", err)
            return res.status(500).json({error: "Internal Server Error"})
        }
    }

    if (login) {
        let {uid, pwd} = login;
        uid = uid.toLowerCase();
        if (!uid && !pwd) {
            return res.json({error: "Please fill in username and password!"});
        }

        const userdata = await usersCollection.findOne({username: uid});
        if (!userdata) {
            return res.json({error: "User does not exist!"})
        }
        
        if (pwd !== userdata.password) {
            return res.json({ error: "Password incorrect!" });
        }
        const data = {
            _id: userdata._id,
            fullname: userdata.fullname,
            isAdmin: userdata.isAdmin,
        }
        return res.json(data);

    }
    if (checkLogin) {
        const _id = checkLogin._id;
        const userdata = await usersCollection.findOne({_id: _id});
        const data = {
            _id: userdata._id,
            fullname: userdata.fullname,
            isAdmin: userdata.isAdmin,
        };
        return res.json(data);
    }
}

const rooms = async(req, res) => {
    const getRooms = req.body.getRooms;
    const getRoom = req.body.getRoom;
    const addRoom = req.body.addRoom;
    const delRoom = req.body.delRoom;
    const rentRoom = req.body.rentRoom;

    if (getRooms) {
        const data = await roomsCollection.find({});
        if (data) {
           return res.json(data);
        }
    }

    if (getRoom) {
        const data = await roomsCollection.findOne({user: getRoom.user_id})
        if (data) {
            return res.json(data);
        }
        return res.json({error: "No room returned"});
    }

    if (addRoom) {
        const maxRoomDoc = await roomsCollection.findOne().sort({ room: -1 }).exec();
        const maxRoomNumber = maxRoomDoc ? maxRoomDoc.room + 1 : 1;
        console.log(maxRoomNumber);
        const newRoom = new roomsCollection({room: maxRoomNumber })

        try {
            await newRoom.save();
            console.log("New room has been created!");
            return res.json({success: "Room created successfully!"});
        } catch (err) {
            console.log("Error creating user", err)
            return res.status(500).json({error: "Internal Server Error"})
        }
    }

    if (delRoom) {
        const data = await roomsCollection.deleteOne({_id: delRoom._id});
        if (data) {
            // console.log(data);
            return res.json({success: "Room has been deleted"});
        }
        return res.json({error: "No data returned"});

    }

    if (rentRoom) {
        const currentDate = new Date();
        const nextMonthDate = new Date();
        const data = await roomsCollection.findOneAndUpdate({_id: rentRoom.room_id}, {$set: { user: new ObjectId(rentRoom.user_id), date_started: currentDate, date_due: nextMonthDate.setMonth(nextMonthDate.getMonth() + 1) }}, {new: true});
        if (data) {
            console.log("Updated room", data);
        } else {
            console.log("User not found.");
        }
        return res.json(data);
    }
    return res.status(500).json({error: "Internal server error"});

}

const users = async (req, res) => {
    const user = req.body.user;
    const data = await usersCollection.findOne({_id: user._id});
    if (data) {
        const userdata = {
            _id: data._id,
            fullname: data.fullname,
            email: data.email,
            username: data.username,
        }
        return res.json(userdata);
    }
    return res.status(500).json({error: "Internal server error"});
}

module.exports = { auth, rooms, users };