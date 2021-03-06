const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let airportData = [];
let airportLocation = [];
let outboundPositions = [];
let inboundPositions = [];
let maxCount = 0;
let focusCityData;
let focusCityName = 'SFO';
let bInbound = false;
let bOutbound = true;
let legend = {
  width: 180,
  height: 120,
  xPos: 20,
  yPos: window.innerHeight-220,
};

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
      'SAN' : { 'outbound' : loadTable('../data/filtered/SAN_2017-outbound.csv', 'csv', 'header'),
                'inbound' : loadTable('../data/filtered/SAN_2017-inbound.csv', 'csv', 'header')},
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
  textSize(25);
}

function draw() {
  clear();
  drawFocusCity();
  if(bOutbound) drawOutboundCities();
  if(bInbound) drawInboundCities();
  drawLegend();
}

function drawLegend() {
  // draw legend border
  fill(25,25,25,95);
  stroke(0);
  rect(legend.xPos, legend.yPos, legend.width, legend.height);

  // draw key for focus city
  fill(255,255,0);
  stroke(255,255,0);
  star(legend.xPos+20, legend.yPos-35 + 60, 5, 15, 5);

  // draw key for outbound flights
  fill(244, 66, 66);
  stroke(244, 66, 66);
  rect(legend.xPos + 10, legend.yPos+30 + 20, 20,20);

  // draw key for inbound flights
  fill(66, 244, 137);
  stroke(66, 244, 137);
  rect(legend.xPos + 10, legend.yPos + 85, 20,20);
  
  fill(0);
  stroke(0);
  textSize(15);
  text("Focus City", legend.xPos+40, legend.yPos + 30);
  text("Outbound Flights", legend.xPos+40, legend.yPos + 65);
  text("Inbound Flights", legend.xPos+40, legend.yPos + 100);
}

function drawFocusCity() {
// draw rotating star around focus city
fill(0,0,0);
stroke(0,0,0);
text(focusCityName, focusCityData.xPos-25, focusCityData.yPos+10);
fill(255,255,0, 100);
stroke(255,255,0);
push();
translate(focusCityData.xPos, focusCityData.yPos);
rotate(frameCount / 200.0);
star(0, 0, 15, 35, 5);
pop();
}

function drawOutboundCities() {
  // draw outbound cities in red
  for(let p of outboundPositions) {
    fill(244, 66, 66,100);  
    stroke(244, 66, 66);
    ellipse(p.xPos, p.yPos, p.diameter*myMap.zoom());
  }
}

function drawInboundCities() {
  // draw inbound cities in blue
  fill(66, 244, 137, 100);
  stroke(66,244,137);
  for(let p of inboundPositions) {
    ellipse(p.xPos+10, p.yPos+10, p.diameter*myMap.zoom());
  }
}

function updateLocations() {
  // clear arrays before each update
  outboundPositions = [];
  inboundPositions = [];
  maxCount = 0;
  updateFocusCity(focusCityName);

  // update outbound flights
  for (let row of airportData[0][focusCityName]['outbound'].rows) { 
    let city = row.get('DEST');
    let cityLocation = airportLocation[city];
    let lat = cityLocation['latitude'];
    let long = cityLocation['longitude'];
    let instances = parseInt(row.get('INSTANCES'));
    let pos = myMap.latLngToPixel(lat, long);
    if(instances > maxCount) maxCount = instances;
    outboundPositions.push( {
      xPos: pos.x,
      yPos: pos.y,
      count: instances,
    });
  }
  let maxDiameter = sqrt(maxCount);

  for(let pos of outboundPositions) {
    pos.diameter = map(sqrt(pos.count), 1, maxDiameter, 2,15);
  }

    // update inbound flights
    maxCount = 0;
    for (let row of airportData[0][focusCityName]['inbound'].rows) { 
      let city = row.get('ORIGIN');
      let cityLocation = airportLocation[city];
      let lat = cityLocation['latitude'];
      let long = cityLocation['longitude'];
      let instances = parseInt(row.get('INSTANCES'));
      let pos = myMap.latLngToPixel(lat, long);
      if(instances > maxCount) maxCount = instances;
      inboundPositions.push( {
        xPos: pos.x,
        yPos: pos.y,
        count: instances,
      });
    }
    maxDiameter = sqrt(maxCount);
  
    for(let pos of inboundPositions) {
      pos.diameter = map(sqrt(pos.count), 1, maxDiameter, 2,15);
    }
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
  let boxName = '';
  focusCityName = name;
  updateLocations();

  for(let box of document.getElementsByName("focusCityCheckBox")) {
    box.checked = false;
  }

  if(name == 'SFO') boxName = 'sfoCheckBox';
  else if(name == 'SJC') boxName = 'sjcCheckBox';
  else if(name == 'OAK') boxName = 'oakCheckBox';
  else if(name == 'LAX') boxName = 'laxCheckBox';
  else if(name == 'SAN') boxName = 'sanCheckBox';

  document.getElementById(boxName).checked = true;
}

function checkBox() {
  bInbound = document.getElementById("inboundBox").checked;
  bOutbound = document.getElementById("outboundBox").checked;
  setCurrentFocusCityLabel()
}

