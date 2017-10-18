var request = require("request");
var jsonfile = require("jsonfile");
var allResults = [];
var completed_requests = 0;
var jsonAllocineComingSoon = "./save/tmp/moviesAllocineComingSoon.json";
var jsonAllocineNowShowing = "./save/tmp/moviesAllocineNowShowing.json";

// saving all the coming soon movies
request(
  "http://api.allocine.fr/rest/v3/movielist?partner=YW5kcm9pZC12Mg&count=25&filter=comingsoon&order=theatercount&format=json&page=1",
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("request working");
      console.log("saving the comingsoon movies started");
      var result = JSON.parse(body);
      var request_numbers = parseInt(result.feed.totalResults / 25);
    } else {
      console.log(error);
    }
    for (var i = 1; i <= request_numbers; i++) {
      request(
        `http://api.allocine.fr/rest/v3/movielist?partner=YW5kcm9pZC12Mg&count=25&filter=comingsoon&order=theatercount&format=json&page=${i}`,
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("request working");
            var resultList = JSON.parse(body);
            allResults.push(resultList);
            console.log(completed_requests);
            console.log(completed_requests === request_numbers);
            completed_requests++;
          } else {
            console.log(error);
          }
          if (completed_requests === request_numbers) {
            console.log(jsonAllocineComingSoon);
            jsonfile.writeFile(
              jsonAllocineComingSoon,
              allResults,
              function(err) {
                if (err !== null) {
                  console.error(err);
                } else {
                  console.log(
                    "JSON saved with " +
                      allResults.length * 25 +
                      " comingsoon movies"
                  );
                }
              }
            );
          }
        }
      );
    }
  }
);

// saving all the now showing movies
request(
  "http://api.allocine.fr/rest/v3/movielist?partner=YW5kcm9pZC12Mg&count=25&filter=nowshowing&order=theatercount&format=json&page=1",
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("request working");
      console.log("saving the nowshowing movies started");
      var result = JSON.parse(body);
      var request_numbers = parseInt(result.feed.totalResults / 25);
    } else {
      console.log(error);
    }
    for (var i = 1; i <= request_numbers; i++) {
      request(
        `http://api.allocine.fr/rest/v3/movielist?partner=YW5kcm9pZC12Mg&count=25&filter=nowshowing&order=theatercount&format=json&page=${i}`,
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("request working");
            var resultList = JSON.parse(body);
            allResults.push(resultList);
            console.log(completed_requests);
            console.log(completed_requests === request_numbers);
            completed_requests++;
          } else {
            console.log(error);
          }
          if (completed_requests === request_numbers) {
            console.log(jsonAllocineNowShowing);
            jsonfile.writeFile(
              jsonAllocineNowShowing,
              allResults,
              function(err) {
                if (err !== null) {
                  console.error(err);
                } else {
                  console.log(
                    "JSON saved with " +
                      allResults.length * 25 +
                      " nowshowing movies"
                  );
                }
              }
            );
          }
        }
      );
    }
  }
);
