
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  // 'access-control-allow-headers': 'content-type, accept',
  'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
  'access-control-max-age': 10 // Seconds.
};

//dataObj for storing responses?
var dataObj = {results: []};
var fs = require('fs');

var requestHandler = function(request, response) {
  var path = '/client/scripts/'
  var fileNames = ['parse.js', 'rooms.js', 'friends.js', 'messages.js', 'formView.js', 'roomsView.js', 'messageView.js', 'messagesView.js', 'app.js' ];
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';
  //http://127.0.0.1:3000
  if (request.url === '/' || request.url.includes('?username=')) {
    fs.readFile('./chatterbox.html', 'utf8', (err, data) => {
      if (err) {
        throw error;
      } else {
        headers['Content-Type'] = 'text/html';
        response.writeHead(statusCode, headers);
        response.end(data);
      }
    });
  } else if (request.url.includes(path)) {
    for (var i = 0; i < fileNames.length; i++) {
      if (request.url === path + fileNames[i]) {
        fs.readFile('.' + path + fileNames[i], 'utf8', (err, jsFile) => {
          if (err) {
            throw error;
          } else {
            headers['Content-Type'] = 'text/javascript';
            response.writeHead(statusCode, headers);
            response.write(jsFile);
            response.end();
          }
        });
      }
    }
    // <link rel="stylesheet" href="client/styles/styles.css">
    // <script src="node_modules/jquery/dist/jquery.js"></script>
    // <script src="node_modules/underscore/underscore.js"></script>
  } else if (request.url.includes('/node_modules/jquery')) {
    fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf8', (err, jsFile) => {
      if (err) {
        throw error;
      } else {
        headers['Content-Type'] = 'text/javascript';
        response.writeHead(statusCode, headers);
        response.write(jsFile);
        response.end();
      }
    });
  } else if (request.url.includes('/node_modules/underscore')) {
    fs.readFile('./node_modules/underscore/underscore.js', 'utf8', (err, jsFile) => {
      if (err) {
        throw error;
      } else {
        headers['Content-Type'] = 'text/javascript';
        response.writeHead(statusCode, headers);
        response.write(jsFile);
        response.end();
      }
    });
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(dataObj));
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    response.writeHead(201, headers);
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      var message = JSON.parse(body);
      dataObj.results.push(message);
      message['message_id'] = dataObj.results.length;
      response.end(JSON.stringify(dataObj));
    });
  } else if (request.method === 'OPTIONS' && request.url === '/classes/messages') {
    response.writeHead(200, headers);
    response.end();
  } else if (request.method === 'GET' && request.url === '/classes/message') {
    response.writeHead(406, headers);
    response.end('406 Not Acceptable: Please use valid: /classes/messages endpoint to get results');
  } else if (request.method === 'GET' && request.url === '/class/messages') {
    response.writeHead(406, headers);
    response.end('406 Not Acceptable: Please use valid: /classes/messages endpoint to get results');
  } else {
    response.writeHead(404, headers);
    response.end('404 Page not found!');
  }



  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// EXPORTS

module.exports.requestHandler = requestHandler;
