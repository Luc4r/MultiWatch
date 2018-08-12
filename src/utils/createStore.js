import { createStore } from 'redux';
import reducer from '../redux/Reducer';

const createCustomStore = (streamsNoDuplicates) => {
  const openedStreams = streamsNoDuplicates.length - 1;

  const initialStoreState = {
    isTopBarHidden: false,
    activeAlerts: 0,
    alertMessages: '',
    openedStreams,
    pinnedStreams: 0,
    pinnedStreamNames: '',
    // USER SETTINGS
    showChat: false,
    darkMode: true,
    videoLayout: 'default'
  };

  const cachedStoreState = JSON.parse(localStorage.getItem('store'));
  if (cachedStoreState) {
    const { showChat, videoLayout, darkMode } = cachedStoreState;
    if (showChat !== undefined) initialStoreState.showChat = showChat;
    else cachedStoreState.showChat = initialStoreState.showChat;

    if (videoLayout !== undefined) initialStoreState.videoLayout = videoLayout;
    else cachedStoreState.videoLayout = initialStoreState.videoLayout;

    if (darkMode !== undefined) initialStoreState.darkMode = darkMode;
    else cachedStoreState.darkMode = initialStoreState.darkMode;
  }
  const store = createStore(reducer, initialStoreState);

  return {store, initialStoreState, cachedStoreState};
};

export default createCustomStore;