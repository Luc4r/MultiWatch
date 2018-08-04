import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Background from './Background';
import TopBar from './TopBar';
import StreamArea from './StreamArea';
import AlertBox from './AlertBox';
import {   
  AppWrapper, 
  RenderAppWrapper,
  RenderAppTitleWrapper,
  RenderAppButton,
  RenderAppDescriptionWrapper  
} from './styled/App';
import createCustomStore from './utils/createStore';

// Remove duplicates from URL
const streamsNoDuplicates = Array.from(new Set(window.location.hash.split('#')));
if (streamsNoDuplicates.length > 1) {
  window.history.pushState('', '', streamsNoDuplicates.join('#'));
}
// Create store
const {
  store, 
  initialStoreState,
  cachedStoreState
} = createCustomStore(streamsNoDuplicates);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldRender: this.getRenderValue()
    };
  };

  getRenderValue = () => {
    const cachedStreams = localStorage.getItem('openedStreams');
    if (!cachedStoreState || !cachedStreams) return true;

    if (streamsNoDuplicates.length > 1) {
      if (streamsNoDuplicates.join('#') === cachedStreams) {
        store.dispatch({ type: 'STORE - CHANGE STATE', state: cachedStoreState });
      } else {
        localStorage.clear();
        localStorage.setItem('store', JSON.stringify(initialStoreState));
      }
    } else if (cachedStoreState.openedStreams !== 0) {
      return false;
    }
    return true;
  };

  renderApp = changeStoreState => {
    if (changeStoreState) {
      window.history.pushState('', '', localStorage.getItem('openedStreams'));
      store.dispatch({ type: 'STORE - CHANGE STATE', state: cachedStoreState });
    } else {
      localStorage.clear();
      store.dispatch({ type: 'STORE - CHANGE STATE', state: initialStoreState });
    }
    this.setState({ shouldRender: true });
  };

  render() {
    const { shouldRender } = this.state;
    return (
      <Provider store={store}>
        <AppWrapper>
          <Background />
          {shouldRender && (
            <AppWrapper>
              <TopBar />
              <StreamArea />
              <AlertBox />
            </AppWrapper>
          )}
          {!shouldRender && (
            <RenderAppWrapper>
              <RenderAppTitleWrapper>
                Do you want to restore last session?
              </RenderAppTitleWrapper>
              <RenderAppButton onClick={() => this.renderApp(true)}>
                Yes
              </RenderAppButton>
              <RenderAppButton onClick={() => this.renderApp(false)}>
                No
              </RenderAppButton>
              <br />
              <RenderAppDescriptionWrapper>
                Last session streams: <br />
                <i>{localStorage.getItem('openedStreams').replace(/#/g, ' ')}</i>
              </RenderAppDescriptionWrapper>
            </RenderAppWrapper>
          )}
        </AppWrapper>
      </Provider>
    );
  };
};

ReactDOM.render(React.createElement(App), document.getElementById('app'));
