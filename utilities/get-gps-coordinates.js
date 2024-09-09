const ExifImage = require("exif").ExifImage;

function getGpsCoordinates(file) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: file }, function (error, exifData) {
        if (error) {
          reject("Error: " + error.message);
        } else {
          const gpsData = exifData.gps;
          if (gpsData && gpsData.GPSLatitude && gpsData.GPSLongitude) {
            let latitude =
              gpsData.GPSLatitude[0] +
              gpsData.GPSLatitude[1] / 60 +
              gpsData.GPSLatitude[2] / 3600;
            let longitude =
              gpsData.GPSLongitude[0] +
              gpsData.GPSLongitude[1] / 60 +
              gpsData.GPSLongitude[2] / 3600;

            // Check if coordinates are in the southern or western hemisphere
            if (gpsData.GPSLatitudeRef === "S") {
              latitude = -latitude;
            }
            if (gpsData.GPSLongitudeRef === "W") {
              longitude = -longitude;
            }

            resolve({
              lat: latitude,
              lon: longitude,
            });
          } else {
            console.log("No GPS data found");
            resolve(null);
          }
        }
      });
    } catch (error) {
      reject("Error: " + error.message);
    }
  });
}

module.exports = getGpsCoordinates;
