require("./../utils/array.js");
var rolevalidator = require("./../AskForUserRole/UserRoleUtils");
var url = require('url');

module.exports.handler = function(req, res) {

  if(rolevalidator.AskRole(req,res)){
    res.write('================\n');
    res.write('ECHO REQUEST\n');
    res.write('================\n');
    var parts = url.parse(req.url, true);
    var query = parts.query;
  }
  else{
      res.writeHead(404, "Not OK", {
          "content-type": "text/plain"
      });
      res.write("No Permitions to this resource");
  }
  /*dump.visited = [];
  dump("request", req, res);*/

  res.end();
}
