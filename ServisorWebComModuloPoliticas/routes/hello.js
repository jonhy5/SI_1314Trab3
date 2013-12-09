
module.exports.chunked = function(request, response) {
  response.write('Hello World\n');
  response.end();
};

module.exports.notChunked = function(request, response) {
  var hello = 'Hello World (not chunked)\n';

  response.writeHead(200, "Super OK", {
    "content-length": hello.length,
    "content-type": "text/plain"
  });

  response.write(hello);
  response.end();
};


