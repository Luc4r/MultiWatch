const enterPressEvent = (event, func) => {
  const enterCharCode = 13;
  const pressedKeyCode = event.keyCode;
  if (pressedKeyCode === enterCharCode) {
    func();
  }
};

export { enterPressEvent };