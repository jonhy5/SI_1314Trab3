var express = require('express');
var connect = require("connect");

var app = express();
app.use(connect.urlencoded());

var echo = require("./routes/echo.js");
app.get("/echo",echo.handler);

var hello = require("./routes/hello.js");
app.get("/hello",hello.notChunked);

var printContacts = require("./routes/PrintContacts.js");
app.get("/PrintUserContacts",printContacts.PrintAllContactsForUser);

var user = require("./routes/User.js");
app.post("/InsertUser",user.InsertUser);
app.get("/GetUser",user.GetUser);

app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');












