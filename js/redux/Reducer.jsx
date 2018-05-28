import removeString from '../universalFunctions/removeString';
import getStateAfterAddingAlert from '../universalFunctions/addAlert';

const mainReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'TOPBAR - TOGGLE':
      newState = { ...state, isTopBarHidden: !state.isTopBarHidden };
      break;
    case 'ALERT - ADD':
      newState = getStateAfterAddingAlert(state, action);
      break;
    case 'ALERT - REMOVE': {
      const newAlertMessages = removeString(state.alertMessages, action.message, ';', '');
      newState = {
        ...state,
        activeAlerts: state.activeAlerts - 1,
        alertMessages: newAlertMessages
      };
      break;
    }
    case 'STREAM - OPEN':
      newState = { ...state, openedStreams: state.openedStreams + 1 };
      break;
    case 'STREAM - CLOSE': {
      newState = { ...state, openedStreams: state.openedStreams - 1 };
      break;
    }
    case 'STREAM - PIN':
      newState = {
        ...state,
        pinnedStreams: state.pinnedStreams + 1,
        pinnedStreamNames: `${state.pinnedStreamNames} ${action.name}`
      };
      break;
    case 'STREAM - UNPIN': {
      const newPinnedStreamNames = removeString(state.pinnedStreamNames, action.name, ' ', '');
      newState = {
        ...state,
        pinnedStreams: state.pinnedStreams - 1,
        pinnedStreamNames: newPinnedStreamNames
      };
      break;
    }
    case 'STREAM - CHANGE LAYOUT':
      newState = { ...state, videoLayout: action.newLayout };
      break;
    case 'CHAT - TOGGLE':
      newState = { ...state, showChat: !state.showChat };
      break;
    case 'STORE - CHANGE STATE':
      newState = action.state;
      break;
    default:
      return state;
  }
  const storageItem = { ...newState, activeAlerts: 0, alertMessages: '' };
  localStorage.setItem('store', JSON.stringify(storageItem));
  return newState;
};

export default mainReducer;
