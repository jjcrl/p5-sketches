async function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB, 360, 100, 100, 100)
  noStroke()
  await loadWeather()
}

function draw() {
  background(0)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}