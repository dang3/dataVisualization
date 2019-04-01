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


function preload() {


}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
} 

function draw() {
    clear();
    //ellipse(50,50,200,200);
}