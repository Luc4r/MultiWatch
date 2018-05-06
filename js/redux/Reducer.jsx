const removeString = (mainString, stringToRemove, separator, replaceWith) => {
  const dividedString = mainString.split(separator);
  let newString = '';
  for (let i = 1; i < dividedString.length; i += 1) {
    if (dividedString[i] === stringToRemove) {
      newString += replaceWith;
    } else {
      newString += `${separator}${dividedString[i]}`;
    }
  }
  return newString;
};

const addAlert = (state, action) => {
  if (state.alertMessages.indexOf(action.message) !== -1) {
    const alertElement = document.getElementById(action.message);
    const alertNumberElement = document.getElementById(`number${action.message}`);
    // Change alert background color
    const bgColor = alertElement.style.backgroundColor;
    const red = parseInt(bgColor.slice(bgColor.indexOf('(') + 1, bgColor.indexOf(',')), 10) + 20;
    if (red < 220) {
      const newBgColor = `rgba(${red},${bgColor.slice(bgColor.indexOf(',') + 1, bgColor.length)}`;
      alertElement.style.backgroundColor = newBgColor;
    }
    // Change number of how many times has this alert been triggered
    const alertNumber = parseInt(alertNumberElement.innerHTML, 10);
    if (alertNumber < 99) {
      alertNumberElement.innerHTML = alertNumber + 1;
      if (alertNumberElement.style.opacity !== '1') {
        alertNumberElement.style.opacity = '1';
      }
    }
    return state;
  }
  return Object.assign({}, state, {
    activeAlerts: state.activeAlerts + 1,
    alertMessages: `${state.alertMessages};${action.message}`
  });
};

const mainReducer = (state, action) => {
  let newState;
  let newBoolValue = false;
  switch (action.type) {
    case 'TOPBAR - SHOW':
      newState = Object.assign({}, state, { isTopBarHidden: false });
      break;
    case 'TOPBAR - HIDE':
      newState = Object.assign({}, state, { isTopBarHidden: true });
      break;
    case 'ALERT - ADD':
      newState = addAlert(state, action);
      break;
    case 'ALERT - REMOVE': {
      const newAlertMessages = removeString(state.alertMessages, action.message, ';', '');
      newState = Object.assign({}, state, {
        activeAlerts: state.activeAlerts - 1,
        alertMessages: newAlertMessages
      });
      break;
    }
    case 'STREAM - OPEN':
      newState = Object.assign({}, state, {
        openedStreams: state.openedStreams + 1
      });
      break;
    case 'STREAM - CLOSE': {
      newState = Object.assign({}, state, {
        openedStreams: state.openedStreams - 1
      });
      break;
    }
    case 'STREAM - CHANGE':
      newState = Object.assign({}, state, { streamNames: action.newStreamNames });
      break;
    case 'STREAM - PIN':
      newState = Object.assign({}, state, {
        pinnedStreams: state.pinnedStreams + 1,
        pinnedStreamNames: `${state.pinnedStreamNames} ${action.name}`
      });
      break;
    case 'STREAM - UNPIN': {
      const newPinnedStreamNames = removeString(state.pinnedStreamNames, action.name, ' ', '');
      newState = Object.assign({}, state, {
        pinnedStreams: state.pinnedStreams - 1,
        pinnedStreamNames: newPinnedStreamNames
      });
      break;
    }
    case 'CHAT - TOGGLE':
      if (state.showChat === false) {
        newBoolValue = true;
      }
      newState = Object.assign({}, state, { showChat: newBoolValue });
      break;
    case 'STORE - CHANGE STATE':
      newState = Object.assign({}, state, action.state);
      break;
    default:
      return state;
  }
  const storageItem = Object.assign({}, newState, { activeAlerts: 0, alertMessages: '' });
  localStorage.setItem('store', JSON.stringify(storageItem));
  return newState;
};

export default mainReducer;
