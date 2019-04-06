// mapbox api key
var key = 'pk.eyJ1IjoiZGRhbmczIiwiYSI6ImNqdHMwaThjdzB2dTA0OHBjaHVveHc3ZXAifQ.JcbAc7CDY40asCSq6olQgw'

// Options for map
const options = {
  lat: 20.407,
  lng: 10.287,
  zoom: 3,
  style: 'mapbox://styles/ddang3/cjtsayqjq7rcf1fmttz9l8oy5',
  pitch: 0,
  studio: true,
};

const mappa = new Mappa('Mapbox', key);
let myMap;
let canvas;
let airportData = [];
let airportLocation;

function preload() {
  airportData.push(loadTable('../data/filtered/SFO_2017-outbound.csv', 'csv', 'header'));
  airportLocation = loadJSON('../data/airports.json');
}

function setup() {
    // Create a tile map and overlay the canvas on top.
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // for debugging
} 

function draw() {
    clear();
    for(let row of airportData[0].rows) {
       let city = row.get('DEST');
       console.log(city);
      // let cityLocation = airportLocation[city];
      // let lat = cityLocation['latitude'];
      // let long = cityLocation['longitude'];
      // const pos = myMap.latLngToPixel(lat, long);
      //ellipse(200, 500, 5, 5);
    }
    noLoop();
}