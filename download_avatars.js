var request = require('request');
var token = require('./secrets');
var fs = require('fs');

var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

if (owner === undefined  || repo === undefined){
  console.log("Please, give both arguments: owner and repo");
} else {
    function getRepoContributors(repoOwner, repoName, cb) {
      var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
          'User-Agent': 'sjskrn',
          'Authorization': token.GITHUB_TOKEN
        }
      };

      request(options, function(err, res, body) {
        cb(err, body);
      });
    }

    getRepoContributors(owner, repo, function(err, result) {
        if (err) {
          console.error("Error:", err);
        }
        console.log(result);
        var users = JSON.parse(result);
        users.forEach(user => {
        function downloadImageByURL(url, filePath) {
          request.get(url)
            .on('error', function (err) {
              throw err;
            })
            .on('response', function (response) {
              console.log('Response Status Code: ', response.statusCode);
            })
            .pipe(fs.createWriteStream(filePath));
        }
        downloadImageByURL(user.avatar_url, "pic/" + user.login + ".jpg");
        });
    });
}
