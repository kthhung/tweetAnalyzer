jQuery(function($){
  var socket = io.connect();

  socket.on('feed', function (data) {
    var twitterFeed = document.getElementById("twitterFeed");
    var newDiv = document.createElement('div');
    newDiv.innerText = data;
    twitterFeed.appendChild(newDiv);
  });

  //Create Chart
  var smoothie = new SmoothieChart();
  var line1 = new TimeSeries();
  smoothie.streamTo(document.getElementById("mycanvas"));
  socket.on('sentimentScores', function (data) {
    setInterval(function() {
      line1.append(new Date().getTime(), data);
    }, 1000);
    smoothie.addTimeSeries(line1);

  })


})
