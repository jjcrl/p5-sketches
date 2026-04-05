let hourlyTemps = []
const ANNUAL_MIN = -7;
const ANNUAL_MAX = 30;
const particle_count = 70
let particles = []
let currentHourIndex = 0
const mockTemps = {
  winter:  [2,2,1,1,1,1,2,3,4,5,6,6,7,6,6,5,4,3,3,2,2,2,2,2],
  spring:  [8,7,7,6,6,7,8,10,12,14,15,16,17,16,15,14,12,11,10,9,9,8,8,8],
  summer:  [16,15,15,14,14,15,17,19,21,23,24,25,26,25,24,23,21,20,19,18,17,17,16,16],
  autumn:  [10,9,9,8,8,9,10,11,12,13,14,14,14,13,12,11,10,10,9,9,9,9,9,10]
}
const season = 'summer'  // change this to explore


class Particle {
  constructor(x, y, size, temp, offset,fixed = false) {
  this.fixed = fixed
  this.position = createVector(x, y)
  this.x = this.position.x
  this.y = this.position.y
  this.size = size
  this.temp = temp
  this.offset = offset
  this.velocity = createVector(0, 0)
  this.acceleration = createVector(0, 0)
}

repel(others) {
  for (let other of others) {
    if (other === this) continue  // skip itself
    const d = dist(this.position.x, this.position.y, other.position.x, other.position.y)
    const minDist = (this.size / 2) + (other.size / 2) + 20
    if (d < minDist && d > 0) {
      const force = p5.Vector.sub(this.position, other.position)
      force.normalize()
      force.mult((minDist - d) / minDist * 8)
      this.applyForce(force)
    }
  }
}
attract(target) {
  const maxSize = min(width, height) * 0.15
  const force = p5.Vector.sub(target, this.position)
  force.normalize()
  const strength = (this.size / maxSize) * 0.3
  force.mult(strength)
  this.applyForce(force)
}

update() {
  if(this.fixed)return
  this.velocity.add(this.acceleration)
  this.position.add(this.velocity)
  this.velocity.mult(0.2)
  this.acceleration.mult(0)
  this.x = this.position.x
  this.y = this.position.y
}

applyForce(force) {
  this.acceleration.add(force)
}

  draw(){
    const hue = tempToHue(this.temp, ANNUAL_MIN, ANNUAL_MAX);
    const colour = tempToColour(this.temp, ANNUAL_MIN, ANNUAL_MAX)
    fill(hue, 100, 100, 100)
    ellipse(this.x, this.y, this.size)
  }
}

    function tempToHue(temp, minTemp, maxTemp) {
      const t = (temp - minTemp) / (maxTemp - minTemp);
      return lerp(180, 340, t);
    }

function tempToColour(temp, minTemp, maxTemp) {
  const t = (temp - minTemp) / (maxTemp - minTemp)
  return {
    h: lerp(180, 340, t),
    s: lerp(30, 90, t),
    b: lerp(100, 80, t)
  }
}

async function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB, 360, 100, 100, 100)
  noStroke()
  await loadWeather()
  hourlyTemps = weatherData.hourlyForecast.map(hourly => hourly.temp)
 // hourlyTemps = mockTemps[season]
  populate()
  particles.sort((a, b) => b.size - a.size)
}


function populate() {
  particles = []

  const time_now = new Date().getTime() / 1000 
  const differences = weatherData.hourlyForecast.map(h => Math.abs(h.datetimeEpoch - time_now))
  currentHourIndex = differences.indexOf(min(differences))

  const maxSize = min(width, height) * 0.15
  const cx = width / 2
  const cy = height / 2

  const remaining = particle_count - 1
  const ring1Count = Math.floor(remaining * 0.2)   // 20% in inner ring
  const ring2Count = Math.floor(remaining * 0.35)  // 35% in middle ring  
  const ring3Count = remaining - ring1Count - ring2Count  // rest in outer ring

const rings = [
  { count: ring1Count, radius: min(width, height) * 0.15, size: maxSize * 0.65 },
  { count: ring2Count, radius: min(width, height) * 0.3,  size: maxSize * 0.55 },
  { count: ring3Count, radius: min(width, height) * 0.5,  size: maxSize * 0.4  },
]

  // current hour at centre
  particles.push(new Particle(cx, cy, maxSize, hourlyTemps[currentHourIndex], currentHourIndex, true))

  // build ordered list of indices radiating out from current hour
  // alternates before/after: +1, -1, +2, -2, +3, -3 ...
  const ordered = []
  for (let i = 1; ordered.length < particle_count - 1; i++) {
    const after = currentHourIndex + i
    const before = currentHourIndex - i
    if (after < particle_count) ordered.push(after)
    if (ordered.length < particle_count - 1 && before >= 0) ordered.push(before)
  }

  let idx = 0
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r]
    for (let j = 0; j < ring.count; j++) {
      if (idx >= ordered.length) break 
      const hourIndex = ordered[idx++]
      const angle = (TWO_PI / ring.count) * j - HALF_PI + r * 0.4
      const x = cx + cos(angle) * ring.radius
      const y = cy + sin(angle) * ring.radius
      particles.push(new Particle(x, y, ring.size, hourlyTemps[hourIndex], hourIndex))
    }
  }
}
// function populate() {
//   particles = []
//   const time_now = new Date().getTime() / 1000
//   const differences = weatherData.hourlyForecast.map(h => Math.abs(h.datetimeEpoch - time_now))
//   currentHourIndex = differences.indexOf(min(differences))
//   const maxSize = min(width, height) * 0.2
//   for (let i = 0; i < particle_count; i++) {
//     let x, y, particleSize
//     const temp = hourlyTemps[i]
//     if (i === currentHourIndex) {
//       x = width / 2
//       y = height / 2
//       particleSize = maxSize
//       particles.push(new Particle(x, y, particleSize, temp, i, true))
//     } else {
//       const angle = random(TWO_PI)
//       const distance = Math.abs(i - currentHourIndex) * (min(width,height) * 0.1)
//       x = width / 2 + cos(angle) * distance
//       y = height / 2 + sin(angle) * distance
//       particleSize = max(maxSize * 0.5, maxSize - Math.abs(i - currentHourIndex) * (maxSize / 6))
//       particles.push(new Particle(x, y, particleSize, temp, i))
//     }
//   }
// }

function draw() {
  let time_now = new Date().getTime() / 1000 - (3600 * 10)
  const day_value = (time_now - sunrise) / (sunset - sunrise)
  const day_progress  = constrain(day_value,0,1)
  //const cx = width / 2;
  //const cy = height / 2;
 // const ringRadius = min(width, height) * 0.4;
  //const circleSize = ringRadius * 0.2;
 // const total = hourlyTemps.length 
  const day_arc= sin(day_progress * PI)
  const sky_hue = tempToHue(curr_temp,ANNUAL_MIN,ANNUAL_MAX) 
  const sky_sat = lerp(0,100,day_arc)
  const sky_bri = lerp(0,60,day_arc)
  background(sky_hue, sky_sat, sky_bri);
  const centre = createVector(width / 2, height / 2)
  for (let p of particles) {
  p.attract(centre)
  p.repel(particles)
  p.update()
  p.draw()
}
}
    // for (let i = 0; i < total; i++) {
    // const hue = tempToHue(hourlyTemps[i], ANNUAL_MIN, ANNUAL_MAX);
    // const angle = (TWO_PI / total) * i - HALF_PI;
    // const x = cx + cos(angle) * ringRadius;
    // const y = cy + sin(angle) * ringRadius;
    // fill(hue, 40, 100, 100);
    // ellipse(x, y, circleSize);
  //}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  populate()
  particles.sort((a, b) => b.size - a.size)
}