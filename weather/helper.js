function tempToColour(temp, minTemp, maxTemp) {
  const t = (temp - minTemp) / (maxTemp - minTemp)
  return {
    h: lerp(180, 340, t),
    s: lerp(30, 90, t),
    b: lerp(100, 80, t)
  }
}

 function tempToHue(temp, minTemp, maxTemp) {
      const t = (temp - minTemp) / (maxTemp - minTemp);
      return lerp(180, 340, t);
    }