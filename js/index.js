const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let airportData = [];
let airportLocation = [];
let positions = [];
let maxCount = 0;
let focusCityData;
let focusCityName = 'LAX';

let options = {
  lat: 35.6213,
  lng: -120.3790,
  zoom: 7,
  style: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
}

function preload() {
  airportData.push({
      'SFO' : { 'outbound' : loadTable('../data/filtered/SFO_2017-outbound.csv', 'csv', 'header'),
                'inbound' : loadTable('../data/filtered/SFO_2017-inbound.csv', 'csv', 'header')},
      'OAK' : { 'outbound' : loadTable('../data/filtered/OAK_2017-outbound.csv', 'csv', 'header'),
                'inbound' : loadTable('../data/filtered/OAK_2017-inbound.csv', 'csv', 'header')},
      'SJC' : { 'outbound' : loadTable('../data/filtered/SJC_2017-outbound.csv', 'csv', 'header'),
                'inbound' : loadTable('../data/filtered/SJC_2017-inbound.csv', 'csv', 'header')},
      'LAX' : { 'outbound' : loadTable('../data/filtered/LAX_2017-outbound.csv', 'csv', 'header'),
                'inbound' : loadTable('../data/filtered/LAX_2017-inbound.csv', 'csv', 'header')},
    });

  airportLocation = loadJSON('../data/airports.json');
}

function setup() {
  // Create a tile map and overlay the canvas on top.
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  updateLocations();
  myMap.onChange(updateLocations);
}

function draw() {
  clear();

  // draw rotating star around focus city
  fill(255,255,0, 100);
  push();
  translate(focusCityData.xPos, focusCityData.yPos);
  rotate(frameCount / 200.0);
  star(0, 0, 15, 35, 5);
  pop();

  // draw cities in red
  fill(255,0,0,100);  
  for(let p of positions) {
    ellipse(p.xPos, p.yPos, p.diameter*myMap.zoom());
  }
}


function updateLocations() {
  positions = [];
  maxCount = 0;
  for (let row of airportData[0][focusCityName]['outbound'].rows) { 
    let city = row.get('DEST');
    let cityLocation = airportLocation[city];
    let lat = cityLocation['latitude'];
    let long = cityLocation['longitude'];
    let instances = parseInt(row.get('INSTANCES'));
    let pos = myMap.latLngToPixel(lat, long);
    if(instances > maxCount) maxCount = instances;
    positions.push( {
      xPos: pos.x,
      yPos: pos.y,
      count: instances,
    });
  }
  let maxDiameter = sqrt(maxCount);

  for(let pos of positions) {
    pos.diameter = map(sqrt(pos.count), 1, maxDiameter, 2,15);
  }
  updateFocusCity(focusCityName);
}

function updateFocusCity(name) {
  let location = airportLocation[name];
  let lat = location['latitude'];
  let long = location['longitude'];
  let pos = myMap.latLngToPixel(lat, long);
  focusCityData = {
    xPos: pos.x,
    yPos: pos.y,
  };
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function setFocusAirport(name) {
  focusCityName = name;
  updateLocations();
}