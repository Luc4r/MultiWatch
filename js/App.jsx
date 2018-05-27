import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './redux/Reducer';
import TopBar from './TopBar';
import StreamArea from './StreamArea';
import AlertBox from './AlertBox';
import { AppWrapper, RenderAppWrapper } from './styled/App';

const link = window.location.hash;
const openedStreams = link.split('#').length - 1;
const initialStoreState = {
  isTopBarHidden: false,
  activeAlerts: 0,
  alertMessages: '',
  openedStreams,
  pinnedStreams: 0,
  pinnedStreamNames: '',
  // USER SETTINGS
  showChat: false,
  videoLayout: 'default'
};
const cachedStoreState = JSON.parse(localStorage.getItem('store'));
if (cachedStoreState.showChat && cachedStoreState.videoLayout) {
  initialStoreState.showChat = cachedStoreState.showChat;
  initialStoreState.videoLayout = cachedStoreState.videoLayout;
}
const store = createStore(reducer, initialStoreState);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      render: this.getRenderValue()
    };
  }

  getRenderValue = () => {
    const cachedStreams = localStorage.getItem('openedStreams');
    if (cachedStoreState && cachedStreams) {
      if (link.length > 1) {
        if (link !== cachedStreams) {
          localStorage.clear();
          localStorage.setItem('store', JSON.stringify(initialStoreState));
        } else {
          store.dispatch({ type: 'STORE - CHANGE STATE', state: cachedStoreState });
        }
        return true;
      }
      if (cachedStoreState.openedStreams !== 0) return false;
    } else if (link !== cachedStreams) {
      localStorage.clear();
      localStorage.setItem('store', JSON.stringify(initialStoreState));
    }
    return true;
  };

  renderApp = changeStoreState => {
    if (changeStoreState) {
      store.dispatch({ type: 'STORE - CHANGE STATE', state: cachedStoreState });
    } else {
      localStorage.clear();
      store.dispatch({ type: 'STORE - CHANGE STATE', state: initialStoreState });
    }
    this.setState({ render: true });
  };

  render() {
    const { render } = this.state;

    return (
      <Provider store={store}>
        <AppWrapper style={{ backgroundColor: '#222222' }}>
          {render && (
            <AppWrapper>
              <TopBar />
              <StreamArea />
              <AlertBox />
            </AppWrapper>
          )}
          {!render && (
            <RenderAppWrapper>
              <p>Do you want to restore last session?</p>
              <button onClick={() => this.renderApp(true)}>Yes</button>
              <button onClick={() => this.renderApp(false)}>No</button>
              <br />
              <span>
                Last session streams: <br />
                <i>{localStorage.getItem('openedStreams').replace(/#/g, ' ')}</i>
              </span>
            </RenderAppWrapper>
          )}
        </AppWrapper>
      </Provider>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('app'));
