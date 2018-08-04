const lastPointerEvents = [];

function iframeEventsDisable() {
  const frames = document.getElementsByTagName('iframe');
  for (let i = 0; i < frames.length; i += 1) {
    lastPointerEvents[i] = frames[i].style.pointerEvents;
    frames[i].style.pointerEvents = 'none';
  }
}

function iframeEventsEnable() {
  const frames = document.getElementsByTagName('iframe');
  for (let i = 0; i < frames.length; i += 1) {
    frames[i].style.pointerEvents = lastPointerEvents[i];
  }
}

export { iframeEventsDisable, iframeEventsEnable };
