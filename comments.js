// Create web server
// Load the comments module
// Use the comments module to create a web page that displays the comments
// The server should listen on port 8080
// The server should respond to the /comments URL
// The server should be able to handle requests for the /comments/new URL

var http = require('http');
var comments = require('./comments');

var server = http.createServer(function(req, res) {
  if (req.url === '/comments') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html><head><title>Comments</title></head><body>');
    res.write('<h1>Comments</h1>');
    comments.list(function(comments) {
      res.write('<ul>');
      comments.forEach(function(comment) {
        res.write('<li>' + comment + '</li>');
      });
      res.write('</ul>');
      res.write('<a href="/comments/new">New Comment</a>');
      res.write('</body></html>');
      res.end();
    });
  } else if (req.url === '/comments/new') {
    if (req.method === 'GET') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<html><head><title>New Comment</title></head><body>');
      res.write('<h1>New Comment</h1>');
      res.write('<form method="POST">');
      res.write('<textarea name="comment"></textarea><br>');
      res.write('<input type="submit">');
      res.write('</form>');
      res.write('</body></html>');
      res.end();
    } else if (req.method === 'POST') {
      var body = '';
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', function() {
        var comment = require('querystring').parse(body).comment;
        comments.create(comment, function() {
          res.writeHead(302, {'Location': '/comments'});
          res.end();
        });
      });
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

server.listen(8080);
console.log('Server is listening on http://localhost:8080');