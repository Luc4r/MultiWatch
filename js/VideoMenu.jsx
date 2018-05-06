import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import MoveAndResize from './VideoMenuMoveAndResize';
import { VideoMenuWrapper, VidMenuButton } from './styled/VideoMenuWrapper';

class VideoMenu extends React.Component {
  constructor(props) {
    super();
    let initialState = {
      menuOpacity: 1,
      menuVisibility: 'visible'
    };
    const cachedState = JSON.parse(localStorage.getItem(`${props.channelName}MenuState`));
    if (initialState !== cachedState && cachedState !== null) {
      initialState = cachedState;
    }
    this.state = initialState;
  }
  componentDidMount() {
    const { channelName } = this.props;
    if (this.props.pinnedStreamNames.indexOf(channelName) !== -1) {
      document.getElementById(`stream${channelName}`).style.pointerEvents = 'auto';
      document.getElementById(channelName).style.transitionDuration = '0.5s';
      document.getElementById(channelName).style.zIndex = 0;
      this.changeVideoPosition();
      this.changeVideoLayout();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.parentState.isPinned !== nextProps.parentState.isPinned) return true;
    if (this.state.menuVisibility !== nextState.menuVisibility) return true;
    return false;
  }

  changeElementSize = (id, width, height) => {
    if (id !== undefined) {
      const element = document.getElementById(id);
      if (width !== 0) element.style.width = width;
      if (height !== 0) element.style.height = height;
    }
  };

  changeVideoPosition = () => {
    const { pinnedStreamNames, pinnedStreams } = this.props;
    const dividedPinnedStreamNames = pinnedStreamNames.split(' ');
    let element;

    for (let i = 1; i < pinnedStreams + 1; i += 1) {
      element = document.getElementById(dividedPinnedStreamNames[i]);
      if (i === 1) {
        element.style.top = '0';
        element.style.left = '0';
      } else if (i === 2 && pinnedStreams !== 2) {
        element.style.top = '0';
        element.style.left = '50%';
      } else if (i === 3 || (i === 2 && pinnedStreams === 2)) {
        element.style.top = '50%';
        element.style.left = '0';
      } else if (i === 4) {
        element.style.top = '50%';
        element.style.left = '50%';
      }
    }
    if (this.props.parentState.isPinned === false) {
      element = document.getElementById(this.props.channelName);
      element.style.top = `10px`;
      element.style.left = `10px`;
    }
  };

  changeVideoLayout = () => {
    const { pinnedStreamNames, pinnedStreams } = this.props;
    const dividedPinnedStreamNames = pinnedStreamNames.split(' ');
    let width = '100%';
    let height = '100%';
    // CHANGE SIZE - on unpin
    if (pinnedStreams === 0 || this.props.parentState.isPinned === false) {
      this.changeElementSize(this.props.channelName, `320px`, `180px`);
    }
    // CHANGE SIZE
    if (pinnedStreams === 1) {
      // to 1 stream pinned
      this.changeElementSize(dividedPinnedStreamNames[1], width, height);
    } else if (pinnedStreams === 2) {
      // to 2 streams pinned
      height = '50%';
      for (let a = 1; a < pinnedStreams; a += 1) {
        this.changeElementSize(dividedPinnedStreamNames[a], width, height);
      }
    } else if (pinnedStreams === 3) {
      // to 3 streams pinned
      width = '50%';
      height = '50%';
      for (let a = 1; a < pinnedStreams; a += 1) {
        this.changeElementSize(dividedPinnedStreamNames[a], width, height);
      }
    } else if (pinnedStreams === 4) {
      // to 4 streams pinned - only pin
      width = '50%';
      height = '50%';
      for (let a = 1; a < pinnedStreams; a += 1) {
        this.changeElementSize(dividedPinnedStreamNames[a], width, height);
      }
    }
    // CALCULATE STYLE - add delay for newest pin
    if (pinnedStreams > 1) {
      if (pinnedStreams === 3) {
        width = '100%';
      }
      setTimeout(() => {
        this.changeElementSize(dividedPinnedStreamNames[pinnedStreams], width, height);
      }, 500);
    }
  };

  pinVideo = () => {
    const { channelName } = this.props;
    // SPECIAL ACTIONS
    if (this.props.pinnedStreams === 4) {
      this.props.addAlert(`You cannot pin more than 4 streams!`);
      return;
    }
    // UPDATE VIDEO DATA
    this.props.setParentState({ isPinned: true });
    document.getElementById(`stream${channelName}`).style.pointerEvents = 'auto';
    document.getElementById(channelName).style.transitionDuration = '0.5s';
    document.getElementById(channelName).style.zIndex = 0;
    // STORE CALL
    this.props.pinIt(this.props.channelName);
    // WAIT FOR UPDATE PROPS
    setTimeout(() => {
      this.changeVideoPosition();
      this.changeVideoLayout();
    });
  };
  unpinVideo = () => {
    const { channelName, zIndex } = this.props;
    // UPDATE VIDEO DATA
    this.props.setParentState({ isPinned: false });
    document.getElementById(channelName).style.zIndex = zIndex;
    // STORE CALL
    this.props.unpinIt(channelName);
    // WAIT FOR UPDATE PROPS
    setTimeout(() => {
      this.changeVideoPosition();
      this.changeVideoLayout();
    });
    // After unpin remove any interaction delay
    setTimeout(() => {
      document.getElementById(channelName).style.transitionDuration = '0s';
    }, 500);
  };

  changeMenuVisibility = () => {
    const { channelName, parentState } = this.props;
    document.getElementById(`stream${channelName}`).style.pointerEvents = 'auto';
    const moveCheckbox = document.getElementById(`move${channelName}`);
    const sizeCheckbox = document.getElementById(`size${channelName}`);
    if (this.state.menuOpacity === 1) {
      // HIDE
      if (parentState.isPinned === false) {
        moveCheckbox.checked = false;
        sizeCheckbox.checked = false;
      }
      this.setState({ menuOpacity: 0, menuVisibility: 'hidden' });
    } else {
      // SHOW
      this.setState({ menuOpacity: 1, menuVisibility: 'visible' });
    }
  };

  closeIt = () => {
    const { channelName, openedStreams, parentState } = this.props;
    document.getElementById(channelName).style.pointerEvents = 'none';
    if (parentState.isPinned === true) {
      this.unpinVideo();
    }
    document.getElementById(channelName).style.transitionDuration = '0.5s';
    document.getElementById(channelName).style.opacity = '0';
    // CLOSE CHAT WHEN NO STREAMS OPENED
    if (openedStreams === 1) {
      const chatElement = document.getElementById('chatBox');
      chatElement.style.transitionDuration = '0.5s';
      chatElement.style.width = `0px`;
      setTimeout(() => {
        chatElement.style.display = 'none';
      }, 500);
      document.getElementById('videoArea').style.width = '100%';
    }
    this.timeout = setTimeout(() => {
      // 0.5s === transition duration
      const newURL = window.location.hash.replace(`#${channelName}`, '');
      if (newURL) {
        window.history.pushState('', '', newURL);
      } else {
        window.history.pushState('', '', window.location.pathname);
      }
      this.props.closeStream(channelName);
      // STORAGE CLEAR DATA
      localStorage.removeItem(`${channelName}State`);
      localStorage.removeItem(`${channelName}MenuState`);
    }, 500);
  };

  render() {
    const { menuOpacity, menuVisibility } = this.state;
    const { channelName, parentState } = this.props;

    let spanStyle;
    let pinOrUnpinFunction = this.pinVideo;
    if (parentState.isPinned === true) {
      spanStyle = { width: 'calc(100% - 64px)' };
      pinOrUnpinFunction = this.unpinVideo;
    }
    localStorage.setItem(`${channelName}MenuState`, JSON.stringify(this.state));

    return (
      <VideoMenuWrapper style={{ opacity: menuOpacity, zIndex: 150 }}>
        <div id="barBackground">
          {parentState.isPinned === false && (
            <MoveAndResize menuVisibility={menuVisibility} channelName={channelName} />
          )}
          <span
            style={spanStyle}
            onClick={this.changeMenuVisibility}
            onKeyDown={this.changeMenuVisibility}
            role="presentation"
          >
            {channelName.charAt(0).toUpperCase() + channelName.slice(1)}
          </span>
          <VidMenuButton
            style={{ visibility: menuVisibility, marginLeft: '2px' }}
            onClick={this.closeIt}
            onKeyDown={this.closeIt}
            role="presentation"
          >
            <div>
              <svg viewBox="0 0 32 32">
                <rect height="30" width="30" x="1" y="1" />
                <line x1="10" x2="22" y1="10" y2="22" />
                <line x1="22" x2="10" y1="10" y2="22" />
              </svg>
            </div>
          </VidMenuButton>
          <VidMenuButton
            style={{ visibility: menuVisibility, marginLeft: '2px' }}
            onClick={pinOrUnpinFunction}
            onKeyDown={pinOrUnpinFunction}
            role="presentation"
          >
            <div>
              <svg viewBox="0 0 32 32">
                <rect height="22" width="22" x="9" y="1" />
                <polyline points="9 9 1 9 1 31 23 31 23 23" />
              </svg>
            </div>
          </VidMenuButton>
        </div>
      </VideoMenuWrapper>
    );
  }
}

VideoMenu.propTypes = {
  parentState: PropTypes.shape({
    isPinned: PropTypes.bool
  }).isRequired,
  channelName: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  setParentState: PropTypes.func.isRequired,

  closeStream: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired,
  pinIt: PropTypes.func.isRequired,
  unpinIt: PropTypes.func.isRequired,

  openedStreams: PropTypes.number.isRequired,
  pinnedStreamNames: PropTypes.string.isRequired,
  pinnedStreams: PropTypes.number.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    closeStream: channelName => {
      dispatch({ type: 'STREAM - CLOSE', name: channelName });
    },
    addAlert: alert => {
      dispatch({ type: 'ALERT - ADD', message: alert });
    },
    pinIt: channelName => {
      dispatch({ type: 'STREAM - PIN', name: channelName });
    },
    unpinIt: channelName => {
      dispatch({ type: 'STREAM - UNPIN', name: channelName });
    },
    toggleChat: () => {
      dispatch({ type: 'CHAT - TOGGLE' });
    }
  };
}

function mapStateToProps(state) {
  return {
    openedStreams: state.openedStreams,
    pinnedStreams: state.pinnedStreams,
    pinnedStreamNames: state.pinnedStreamNames
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoMenu);
