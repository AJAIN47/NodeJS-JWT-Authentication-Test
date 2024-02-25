const express = require("express");
const path = require("path");
const exjwt = require("express-jwt");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
const secretKey = "My super secret key";

const jwtMW = exjwt.expressjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "alish",
    password: "123",
  },
  {
    id: 2,
    username: "Jinita",
    password: "456",
  },
  {
    id: 3,
    username: "Nishi",
    password: "789",
  },
];

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can see!!!",
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  for (let user of users) {
    if (username === user.username && password === user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });

      return;
    }
  }
  res.status(401).json({
    success: false,
    token: null,
    err: "Username or password is incorrect",
  });
});

app.get("/api/prices", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "This is of price $5.4",
  });
});

// settings route added and protected
app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "This is Settings page with change of url as well",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password is incorrect 2",
    });
    return;
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`API served at ${port}`);
});
