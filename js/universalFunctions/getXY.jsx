function getX(e) {
  // DESKTOP:
  let x = e.pageX;
  // MOBILE:
  if (x === undefined) {
    x = e.touches[0].pageX;
  }
  return x;
}

function getY(e) {
  // DESKTOP:
  let y = e.pageY;
  // MOBILE:
  if (y === undefined) {
    y = e.touches[0].pageY;
  }
  return y;
}

export { getX, getY };
