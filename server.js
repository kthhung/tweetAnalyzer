var express = require('express');
var app = express();

var sentiment = require('sentiment');
var twitter = require('ntwitter');

var server = require('http').createServer(app);
var port = process.env.PORT || 8080;

var io = require('socket.io').listen(server);

var config = require('./config');
var tweeter = new twitter(config);

server.listen(port);
console.log('Server is running...');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var stream;
var tweetCount = 0;
var phrase = 'apple';
var totalSentiment = 0;
var averageSentiment;

tweeter.verifyCredentials(function (error, data) {
  if (error) {
    console.log('Error connceting to Twitter');
  }
  stream = tweeter.stream('statuses/filter', {'track': phrase}, function (stream) {
    stream.on('data', function (data) {
      tweetCount++;
      io.sockets.emit('feed', data.text);
      if (data.lang === 'en') {
      sentiment(data.text, function (err, result) {
        totalSentiment += result.score;
        averageSentiment = totalSentiment / tweetCount;
        io.sockets.emit('sentimentScores', averageSentiment);
        console.log(averageSentiment);
      });
      };
    });
  });
});
