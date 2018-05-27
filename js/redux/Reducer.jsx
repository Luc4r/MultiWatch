const removeString = (mainString, stringToRemove, separator, replaceWith) => {
  const newString = mainString.split(separator).reduce((previous, string) => {
    if (string === stringToRemove) return `${previous}${replaceWith}`;
    return `${separator}${string}`;
  });
  return newString;
};

const addAlert = (state, action) => {
  if (state.alertMessages.includes(action.message)) {
    const alertElement = document.getElementById(action.message);
    const alertNumberElement = document.getElementById(`number${action.message}`);
    // Change alert background color
    const bgColor = alertElement.style.backgroundColor;
    const newRed = parseInt(bgColor.slice(bgColor.indexOf('(') + 1, bgColor.indexOf(',')), 10) + 20;
    if (newRed < 220) {
      const newBg = `rgba(${newRed},${bgColor.slice(bgColor.indexOf(',') + 1, bgColor.length)}`;
      alertElement.style.backgroundColor = newBg;
    }
    // Change number of how many times has this alert been triggered
    const alertNumber = parseInt(alertNumberElement.innerHTML, 10);
    if (alertNumber < 99) {
      alertNumberElement.innerHTML = alertNumber + 1;
      if (!alertNumberElement.style.opacity) {
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
  switch (action.type) {
    case 'TOPBAR - TOGGLE':
      newState = Object.assign({}, state, { isTopBarHidden: !state.isTopBarHidden });
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
    case 'STREAM - CHANGE LAYOUT':
      newState = Object.assign({}, state, { videoLayout: action.newLayout });
      break;
    case 'CHAT - TOGGLE':
      newState = Object.assign({}, state, { showChat: !state.showChat });
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
