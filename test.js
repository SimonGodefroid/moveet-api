// var moviesAllocineComingSoon = require("./save/tmp/moviesAllocineComingSoon.json");

// var offset = 0;
// var i = 1;
// moviesAllocineComingSoon.forEach(function(movie) {
//   setTimeout(
//     function() {
//       console.log(movie.code);
//       console.log("i", i);
//       i++;
//     },
//     1 + offset
//   );

//   offset += 1;
//   if (i === moviesAllocineComingSoon.length) {
//     console.log("i à la fin", i);
//   }
// });

// var buddiesRequests = [
//   {
//     _id: {
//       _id: "58ffcb1ada59b62eb048d700",
//       account: {
//         username: "Kikie",
//         age: 23,
//         description: "coucou je m'appelle Kikie. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit nulla totam debitis provident, iste, incidunt hic quia deleniti libero magni. Reprehenderit labore voluptates cupiditate doloribus saepe vero, quo tenetur maiores.",
//         genre: "Femme",
//         subscription: "UGC Illimité",
//         buddiesRequests: [
//           {
//             _id: "58ffcb1ada59b62eb048d6ff",
//             status: "pending",
//             created: "2017-04-26T11:04:59.126Z"
//           }
//         ],
//         buddies: [],
//         favorites: []
//       }
//     },
//     status: "sent",
//     created: "2017-04-26T11:04:59.121Z"
//   },
//   {
//     _id: {
//       _id: "58ffcb1ada59b62eb048d702",
//       account: {
//         username: "Valentine",
//         age: 21,
//         description: "coucou je m'appelle Valentine. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit nulla totam debitis provident, iste, incidunt hic quia deleniti libero magni. Reprehenderit labore voluptates cupiditate doloribus saepe vero, quo tenetur maiores.",
//         genre: "Femme",
//         subscription: "UGC Illimité",
//         buddiesRequests: [
//           {
//             _id: "58ffcb1ada59b62eb048d6ff",
//             created: "2017-04-25T22:20:36.917Z"
//           }
//         ],
//         buddies: [],
//         favorites: []
//       }
//     },
//     status: "sent",
//     created: "2017-04-26T21:39:50.445Z"
//   },
//   {
//     _id: {
//       _id: "58ffcb1ada59b62eb048d701",
//       account: {
//         username: "Arthur",
//         age: 22,
//         description: "coucou je m'appelle Arthur. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit nulla totam debitis provident, iste, incidunt hic quia deleniti libero magni. Reprehenderit labore voluptates cupiditate doloribus saepe vero, quo tenetur maiores.",
//         genre: "Homme",
//         subscription: "UGC Illimité",
//         buddiesRequests: [
//           {
//             _id: "58ffcb1ada59b62eb048d6ff",
//             status: "pending",
//             created: "2017-04-26T21:40:09.907Z"
//           }
//         ],
//         buddies: [],
//         favorites: []
//       }
//     },
//     status: "sent",
//     created: "2017-04-26T21:40:09.907Z"
//   }
// ];

// var dataArray = new Array();
// for (var o in buddiesRequests) {
//   dataArray.push(buddiesRequests[o]["_id"]);
// }
// console.log(dataArray.length);

// var buddiesRequests = [
//   {
//     _id: {
//       _id: "5901b760bc4d3c198039304d",
//       email: "kikie@moveet.com",
//       token: "NBB2gwHi4YtHOGn8",
//       __v: 1,
//       account: {
//         username: "Kikie",
//         age: 23,
//         description: "coucou je m'appelle Kikie. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit nulla totam debitis provident, iste, incidunt hic quia deleniti libero magni. Reprehenderit labore voluptates cupiditate doloribus saepe vero, quo tenetur maiores.",
//         genre: "Femme",
//         subscription: "UGC Illimité",
//         buddiesRequests: [
//           {
//             _id: "5901b760bc4d3c1980393052",
//             status: "pending",
//             created: "2017-04-27T09:20:27.337Z"
//           }
//         ],
//         buddies: [],
//         favorites: []
//       }
//     },
//     status: "sent",
//     created: "2017-04-27T09:20:27.331Z"
//   }
// ];

// console.log(buddiesRequests.length);

// // 104 rue bobillot
// var lat1 = 48.8227383;
// var long1 = 2.3447517;
// // le rendez-vous
// var lat2 = 48.83364;
// var long2 = 2.3315991;

// console.log(getDistanceFromLatLonInKm(lat1, long1, lat2, long2));

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2 - lat1); // deg2rad below
//   var dLon = deg2rad(lon2 - lon1);
//   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = R * c; // Distance in km
//   return d;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

// var _ = require("lodash");

// var array1 = [
//   { _id: "58fa579991f468fc47f1f10e", originalTitle: "Cessez-le-feu" },
//   { _id: "58fa579b91f468fc47f1f112", originalTitle: "Patients" }
// ];

// var array2 = [
//   "58fa579091f468fc47f1f0fc",
//   "58fa595891f468fc47f1f48c",
//   "58fa58e091f468fc47f1f39c",
//   "58fa579f91f468fc47f1f11a",
//   "58fa579991f468fc47f1f10e"
// ];

// var arrId = array1.map(function(x) {
//   return x._id.toString();
// });

// console.log(_.intersection(arrId, array2));
// require("dotenv").config();
// var cloudinary = require("cloudinary");

// cloudinary.uploader.upload("data:image/gif;base64," + data, function(result) {
//   console.log(result);
// });
var allocine = require("./services/AllocineShowTimes.js");

allocine.api(
  "showtimelist",
  {
    code: 419350304
  },
  function(error, results) {
    if (error) {
      console.log("Error : " + error);
      return;
    }
    console.log(results);
  }
);
