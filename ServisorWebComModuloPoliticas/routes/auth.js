module.exports.signin = function(req, res) {
  
  console.log("METHOD: ", req.method);
  if(req.method == "GET") return res.render("auth/signin");

  return res.end("POST");

}

module.exports.register = function(req, res) {
  console.log("METHOD: ", req.method);
  if(req.method == "GET") return res.render("auth/register");

  console.log("BODY: ", req.body);
  console.log("FILES: ", req.files);
  return res.end("POST");
}