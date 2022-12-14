var handler = require('../request-handler');
var expect = require('chai').expect;
var stubs = require('./Stubs');
var $ = require('jquery');

describe('Node Server Request Listener Function', function() {
  it('Should answer GET requests for /classes/messages with a 200 status code', function() {
    // This is a fake server request. Normally, the server would provide this,
    // but we want to test our function's behavior totally independent of the server code
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    expect(res._ended).to.equal(true);
  });

  it('Should send back an object', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.be.an('object');
    expect(res._ended).to.equal(true);
  });

  it('Should send an object containing a `results` array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.have.property('results');
    expect(parsedBody.results).to.be.an('array');
    expect(res._ended).to.equal(true);
  });

  it('Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    // Expect 201 Created response status
    expect(res._responseCode).to.equal(201);

    // Testing for a newline isn't a valid test
    // TODO: Replace with with a valid test
    // expect(res._data).to.equal(JSON.stringify('\n'));
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    // First post
    var stubMsg1 = {
      username: 'Bobo',
      text: 'Hello!'
    };

    var req = new stubs.request('/classes/messages', 'POST', stubMsg1);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Second post
    var stubMsg2 = {
      username: 'Momo',
      text: 'Hi!'
    };

    var req = new stubs.request('/classes/messages', 'POST', stubMsg2);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[2].username).to.equal('Bobo');
    expect(messages[2].text).to.equal('Hello!');
    expect(messages[3].username).to.equal('Momo');
    expect(messages[3].text).to.equal('Hi!');
    expect(res._ended).to.equal(true);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    // var result = (data) => { console.log(data); };
    // $.ajax({
    //   url: 'http://127.0.0.1:3000/classes/messages',
    //   type: 'HEAD',
    //   data: 'Headers not available.',
    //   contentType: 'application/json',
    //   success: result,
    //   error: function (error) {
    //     console.error('chatterbox: Failed to create message', error);
    //   }
    // });
    var req = new stubs.request('/class/messages', 'GET');
    var res = new stubs.response(true);

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(406);
    expect(res._ended).to.equal(true);
  });

  it('Direct user to acceptable HTTP methods', function() {
    var req = new stubs.request('/classes/message', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(406);
    expect(res._ended).to.equal(true);
  });
});
