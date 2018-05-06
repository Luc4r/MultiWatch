function getWindowWidth() {
  let windowWidth = document.body.clientWidth;
  if (windowWidth < 700) {
    windowWidth = 700;
  }
  return windowWidth;
}

function getWindowHeight() {
  let windowHeight = document.body.clientHeight;
  if (windowHeight < 400) {
    windowHeight = 400;
  }
  return windowHeight;
}

export { getWindowWidth, getWindowHeight };
