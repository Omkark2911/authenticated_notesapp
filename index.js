const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const notes = [];
const users = [];

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(403).json({
            message: "user with this username already exists "
        })
    }


    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "you have signed up"
    })
})

app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find(user => user.username === username && user.password === password);
    if (!userExists) {
        res.status(403).json({
            message: "Incorrect info"
        })
        return;
    }

    const token = jwt.sign({
        username: username
    }, "omkar123")

    res.json({
        token: token
    })
})


// post - create a note
//authenticated notes app
app.post("/notes", function (req, res) {

const token = req.headers.token;
    if (!token) {
        res.status(403).json({
            message: "you are not logged in"
        });
        return;
    }

    const decoded = jwt.verify(token, "omkar123");
    const username = decoded.username;

    if (!username) {
        res.status(403).json({
            message: "malformed token"
        })
        return;
    }


    const note = req.body.note;
    notes.push({ note, username });

    res.json({
        message: "Done!"
    })
})


// get - get all the note

app.get("/notes",function (req, res) {

    const token = req.headers.token;
    if (!token) {
        res.status(403).json({
            message: "you are not logged in"
        });
        return;
    }

    const decoded = jwt.verify(token, "omkar123");
    const username = decoded.username;

    if (!username) {
        res.status(403).json({
            message: "malformed token"
        })
        return;
    }


    const userNotes = notes.filter(note => note.username === username);
    res.json({
        notes: userNotes
    })
})

app.get("/", function (req, res) {
    res.sendFile("/Users/omkar/Development/learning backend/backend0.6/index.html")
})

app.get("/signup", function (req, res) {
    res.sendFile("/Users/omkar/Development/learning backend/backend0.6/signup.html")
})

app.get("/signin", function (req, res) {
    res.sendFile("/Users/omkar/Development/learning backend/backend0.6/signin.html")
})
app.listen(3004);