const getWindowWidth = () => {
  let windowWidth = document.body.clientWidth;
  if (windowWidth < 700) {
    windowWidth = 700;
  }
  return windowWidth;
};

const getWindowHeight = () => {
  let windowHeight = document.body.clientHeight;
  if (windowHeight < 400) {
    windowHeight = 400;
  }
  return windowHeight;
};

const getVideoAreaWidth = () => {
  const marginRight = document.getElementById('videoArea').style.width;
  if (marginRight === '100%' || !marginRight) {
    return getWindowWidth();
  }
  return parseInt(marginRight, 10);
};

export { getWindowWidth, getWindowHeight, getVideoAreaWidth };
