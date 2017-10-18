var request = require("request");
var jsonfile = require("jsonfile");
var allResults = [];
var completed_requests = 0;
var failedRequestsSaveComingSoon = [];
var jsonAllocineComingSoon = "./save/tmp/moviesAllocineComingSoon.json";
var jsonFailedRequestsSaveComingSoon = "./save/tmp/jsonFailedRequestsSaveComingSoon.json";

//var jsonAllocineNowShowing = "./save/tmp/moviesAllocineNowShowing.json";

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
      console.log("err in getting page numbers", error);
    }
    for (var i = 1; i <= request_numbers; i++) {
      request(
        `http://api.allocine.fr/rest/v3/movielist?partner=YW5kcm9pZC12Mg&count=25&filter=comingsoon&order=theatercount&format=json&page=${i}`,
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("request working");
            var resultList = JSON.parse(body);
            allResults.push(resultList.feed.movie);
            console.log(completed_requests);
            console.log(completed_requests === request_numbers);
            completed_requests++;
          } else {
            console.log("err in req ", error);
            failedRequestsSaveComingSoon.push({ page: i, errorMessage: error });
          }
          if (completed_requests === request_numbers) {
            console.log(jsonAllocineComingSoon);
            console.log(allResults.length);
            var dataToSave = [].concat.apply([], allResults);
            jsonfile.writeFile(
              jsonAllocineComingSoon,
              dataToSave,
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
            jsonfile.writeFile(
              jsonFailedRequestsSaveComingSoon,
              failedRequestsSaveComingSoon,
              function(err) {
                if (err !== null) {
                  console.error(err);
                } else {
                  console.log(
                    "JSON saved with " +
                      failedRequestsSaveComingSoon.length +
                      " requests errors in saving coming soon movies"
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
