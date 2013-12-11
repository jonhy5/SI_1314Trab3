/**
 * Created by André Jonas on 08-12-2013.
 */

var http = require('http'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync("./config.json"));  // Sync because we need all loaded b4 continuing.

//
// Server
//
var app = http.createServer(function(req, res){
    // do stuff here
});

app.listen(config.port);
