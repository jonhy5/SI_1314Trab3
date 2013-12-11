var express = require('express');
var connect = require("connect");
var pdp = require('../pdp/pdp');

var app = express();
app.use(connect.urlencoded());

pdp.loadPolicy('./policies.json');

function rbacChecker(req, res, next){
    var name = req.query.name || "unknown";
    var page = req.path;
    var method = req.method;
    //res.send(name + ' ' + page + ' ' + method);
    if(pdp.canAccess(name, method, page)){
        next();
    }else{
        res.send(401, 'User has no permission to access the resource');
    }
}

var echo = require("./routes/echo.js");
app.get("/echo", rbacChecker, echo.handler);

var hello = require("./routes/hello.js");
app.get("/hello", rbacChecker, hello.notChunked);

var printContacts = require("./routes/PrintContacts.js");
app.get("/PrintUserContacts", rbacChecker, printContacts.PrintAllContactsForUser);

var user = require("./routes/User.js");
app.post("/InsertUser", rbacChecker, user.InsertUser);
app.get("/GetUser", rbacChecker, user.GetUser);

app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');












