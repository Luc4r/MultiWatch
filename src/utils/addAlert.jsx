const changeAlertCount = message => {
  const alertNumberElement = document.getElementById(`number${message}`);
  const alertNumber = parseInt(alertNumberElement.innerHTML, 10);
  if (alertNumber < 99) {
    alertNumberElement.innerHTML = alertNumber + 1;
    if (!alertNumberElement.style.opacity) {
      alertNumberElement.style.opacity = '1';
    }
  }
};

const changeAlertBackground = message => {
  const alertElement = document.getElementById(message);
  const alertBGColor = alertElement.style.backgroundColor;
  const bgColor = alertBGColor ? alertBGColor : 'rgba(84,84,84, 0.85)';
  const newRed = parseInt(bgColor.slice(bgColor.indexOf('(') + 1, bgColor.indexOf(',')), 10) + 20;
  if (newRed < 220) {
    const newBg = `rgba(${newRed},${bgColor.slice(bgColor.indexOf(',') + 1, bgColor.length)}`;
    alertElement.style.backgroundColor = newBg;
  }
};

const getStateAfterAddingAlert = (state, action) => {
  if (state.alertMessages.includes(action.message)) {
    changeAlertBackground(action.message);
    changeAlertCount(action.message);
    return state;
  }
  return {
    ...state,
    activeAlerts: state.activeAlerts + 1,
    alertMessages: `${state.alertMessages};${action.message}`
  };
};

export default getStateAfterAddingAlert;
