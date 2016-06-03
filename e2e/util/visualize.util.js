var fs = require("fs");
var path = require("path");

exports.preserveScreenShot = preserveScreenShot;
exports.takeScreenShot = takeScreenShot;

/**
 * @description - preserve screen shot into local machine
 *
 * @param {string} filename
 * @param {string} data - base64 encoded capture
 */
function preserveScreenShot(filename, data) {
  var capture
    , stream;
  
  capture = path.join(__dirname, "../image", filename);
  stream = fs.createWriteStream(capture);
  
  stream.write(new Buffer(data, "base64"));
  stream.end();
}

/**
 * @description - preserve screen shot into local machine
 *
 * @param {string} filename
 */
function takeScreenShot(filename) {
  browser.takeScreenshot().then(function (response) {
    preserveScreenShot(filename, response);
  });
}