const config = require('./config/app');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

performRequest = (endpoint, callback, method = 'GET') => {
  request(
    {
      method: method,
      uri: endpoint,
      gzip: true,
      encoding: null
    }, callback
  )
}

getBusStations = (callback) => {
  let stations = {};
  const endpoint = config.ENDPOINTS.ORIGIN + config.ROUTES.STATIONS
  performRequest(endpoint, function(error, response, body) {
    const $ = cheerio.load(iconv.decode(body, 'win1251'));
    let stationsNodes = $(`table[style=\'font-size:60%;border: #528d5c 1px dashed;\'] tbody tr > td > a`);
    stationsNodes.each(function(index, el) {
      const stationCode = $(this).attr('href').split('=')[1];
      stations[$(this).text()] = stationCode;
    })  
    
    callback(stations);
  })
}

module.exports = {
  getBusStations
}