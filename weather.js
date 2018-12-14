const https = require('https');
const api = require('./api.json');

// Print out temp details
function printWeather(weather) {
    const message = `Current temperature in ${weather.location.city} is ${weather.current_observation.temp_f}F`;
    console.log(message);
}
// Print out error message
function printError(error) {
  console.error(error.message);
}

function get(query) {
  //take out underscores for readability
  const readableQuery = query.replace('_', '');
  try {
    const request = https.get(`https://api.wunderground.com/api/${api.key}/geolookup/conditions/q/${query}.json`, response => {
      if(response.statusCode === 200) {
        let body = "";
        // Read the data
        response.on('data', chunk => {
            body += chunk;
        });
        response.on('end', () => {
          try {
            const weather = JSON.parse(body);
            // Check if the location is found before printing
            if(weather.location) {
              // Print the data
              printWeather(weather);
            } else {
              const queryError = new Error(`The location "${readableQuery}" was not found.`);
              printError(queryError);
            }
          } catch (error) {
            // Parse Error
            printError(error);
          }
        });
      } else {
          // status code error
          const statusCodeError = new Error(`There was an error getting the message for ${readableQuery}. (${http.STATUS_CODES[response.statusCode]})`);
          printError(statusCodeError);
      }
    });
  } catch (error) {
    //Malformed URL Error
    printError(error);
  }
}

module.exports.get = get;

//TODO: Handle any errors
