function tempToColour(temp, minTemp, maxTemp) {
  const t = (temp - minTemp) / (maxTemp - minTemp)
  return {
    h: lerp(180, 340, t),
    s: lerp(30, 90, t),
    b: lerp(100, 80, t)
  }
}

function backgroundColour(){
const day_value = (time_now - sunrise) / (sunset - sunrise)
  const day_progress  = constrain(day_value,0,1)
  //const cx = width / 2;
  //const cy = height / 2;
 // const ringRadius = min(width, height) * 0.4;
  //const circleSize = ringRadius * 0.2;
 // const total = hourlyTemps.length 
  const day_arc= sin(day_progress * PI)
  const sky_hue = tempToHue(curr_temp,ANNUAL_MIN,ANNUAL_MAX) - 5
  const sky_sat = lerp(0,70,day_arc)
  const sky_bri = lerp(0,90,day_arc)
  background(sky_hue, sky_sat, sky_bri);

  function tempToHue(temp, minTemp, maxTemp) {
  const t = (temp - minTemp) / (maxTemp - minTemp);
  return lerp(180, 340, t);
}
}