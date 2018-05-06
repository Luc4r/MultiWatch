import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './redux/Reducer';
import TopBar from './TopBar';
import StreamArea from './StreamArea';
import AlertBox from './AlertBox';
import { AppWrapper, RenderAppWrapper } from './styled/AppWrapper';

const link = window.location.hash;
const dividedStreamNames = link.split('#');
let openedStreams = dividedStreamNames.length - 1;
if (link === '') { 
  openedStreams = 0;
}
const initialStoreState = {
  isTopBarHidden: false,
  activeAlerts: 0,
  alertMessages: '',
  openedStreams,
  pinnedStreams: 0,
  pinnedStreamNames: '',
  // USER SETTINGS
  showChat: false
};
const cachedStoreState = JSON.parse(localStorage.getItem('store'));
if (cachedStoreState !== null) {
  initialStoreState.showChat = cachedStoreState.showChat;
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
    if (cachedStoreState !== null) {
      if (link.length > 1) {
        if (link !== localStorage.getItem('openedStreams')) {
          localStorage.clear();
          localStorage.setItem('store', JSON.stringify(initialStoreState));
        } else {
          store.dispatch({ type: 'STORE - CHANGE STATE', state: cachedStoreState });
        }
        return true;
      }
      if (cachedStoreState.openedStreams !== 0) return false;
    } else if (link !== localStorage.getItem('openedStreams')) {
      localStorage.clear();
      localStorage.setItem('store', JSON.stringify(initialStoreState));
    }
    return true;
  };

  renderApp = changeStoreState => {
    if (changeStoreState === true) {
      store.dispatch({ type: 'STORE - CHANGE STATE', state: cachedStoreState });
    } else {
      localStorage.clear();
    }
    this.setState({ render: true });
  };

  render() {
    const { render } = this.state;

    return (
      <Provider store={store}>
        <AppWrapper style={{ backgroundColor: '#222222' }}>
          {render === true && (
            <AppWrapper>
              <TopBar />
              <StreamArea />
              <AlertBox />
            </AppWrapper>
          )}
          {render === false && (
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
