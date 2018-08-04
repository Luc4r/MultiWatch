import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VideoMenuButton } from './styled/VideoMenu';
import { getWindowWidth, getWindowHeight } from './universalFunctions/windowProperties';

class MoveAndResize extends React.Component {
  componentDidMount() {
    const { enteredName, pinnedStreamNames } = this.props;
    const videoElement = document.getElementById(enteredName);
    if (pinnedStreamNames.includes(enteredName)) {
      document.getElementById(`stream${enteredName}`).style.pointerEvents = 'auto';
      videoElement.style.transitionDuration = '0.5s';
      videoElement.style.zIndex = 0;
      this.changeVideoPosition();
      this.changeVideoSizes();
    }
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.videoLayout !== nextProps.videoLayout) {
      setTimeout(() => {
        this.changeVideoPosition();
        this.changeVideoSizes();
      });
    }
    return true;
  };

  getStoragedProperties = stream => {
    let { left, top, width, height } = JSON.parse(localStorage.getItem(`${stream}Properties`));
    const marginRight = document.getElementById('videoArea').style.width;
    let videoAreaWidth = parseInt(marginRight, 10);
    if (marginRight === '100%' || !marginRight) videoAreaWidth = getWindowWidth();
    if (left + width + 5 > videoAreaWidth || top + height + 5 > getWindowHeight()) {
      left = 10;
      top = 10;
      width = 320;
      height = 180;
    }
    return { left, top, width, height };
  };

  getNewVideoPosition = (i, pinnedStreams) => {
    const { videoLayout } = this.props;
    let top = '0';
    let left = '0';
    if (videoLayout === 'default') {
      if (i === 2 && pinnedStreams !== 2) {
        left = '50%';
      } else if (i === 3 || (i === 2 && pinnedStreams === 2)) {
        top = '50%';
      } else if (i === 4) {
        top = '50%';
        left = '50%';
      }
    } else if (videoLayout === 'vertical') {
      if (i === 2 && pinnedStreams === 2) top = '50%';
      else if (pinnedStreams === 3) top = `${33.33 * (i - 1)}%`;
      else if (pinnedStreams === 4) top = `${25 * (i - 1)}%`;
    } else if (videoLayout === 'horizontal') {
      if (i === 2 && pinnedStreams === 2) left = '50%';
      else if (pinnedStreams === 3) left = `${33.33 * (i - 1)}%`;
      else if (pinnedStreams === 4) left = `${25 * (i - 1)}%`;
    }
    return { top, left };
  };

  getNewVideoSize = (i, pinnedStreams) => {
    const { videoLayout } = this.props;
    let height = '100%';
    let width = '100%';
    if (videoLayout === 'default') {
      if (pinnedStreams === 2) {
        height = '50%';
      } else if (pinnedStreams === 3 || pinnedStreams === 4) {
        height = '50%';
        width = '50%';
      }
    } else if (videoLayout === 'vertical') {
      if (pinnedStreams === 2) height = '50%';
      else if (pinnedStreams === 3) height = '33.33%';
      else if (pinnedStreams === 4) height = '25%';
    } else if (videoLayout === 'horizontal') {
      if (pinnedStreams === 2) width = '50%';
      else if (pinnedStreams === 3) width = '33.33%';
      else if (pinnedStreams === 4) width = '25%';
    }
    return { height, width };
  };

  changeVideoPosition = () => {
    const { pinnedStreamNames, pinnedStreams } = this.props;
    const dividedPinnedStreamNames = pinnedStreamNames.split(' ');
    let element;
    for (let i = 1; i <= pinnedStreams; i += 1) {
      const { top, left } = this.getNewVideoPosition(i, pinnedStreams);
      element = document.getElementById(dividedPinnedStreamNames[i]);
      element.style.top = top;
      element.style.left = left;
    }
  };

  changeVideoSizes = () => {
    const { pinnedStreamNames, pinnedStreams, videoLayout } = this.props;
    const dividedPinnedStreamNames = pinnedStreamNames.split(' ');
    let element;
    for (let i = 1; i <= pinnedStreams; i += 1) {
      const { height, width } = this.getNewVideoSize(i, pinnedStreams);
      element = document.getElementById(dividedPinnedStreamNames[i]);
      element.style.width = width;
      element.style.height = height;
      if (pinnedStreams === 3 && i === 3 && videoLayout === 'default') {
        element.style.width = '100%';
      }
    }
  };

  pinVideo = () => {
    const { enteredName } = this.props;
    const videoElement = document.getElementById(enteredName);
    // SPECIAL ACTIONS
    if (this.props.pinnedStreams === 4) {
      this.props.addAlert(`You cannot pin more than 4 streams!`);
      return;
    }
    // UPDATE VIDEO DATA
    this.props.setGrandParentState({ isPinned: true });
    document.getElementById(`stream${enteredName}`).style.pointerEvents = 'auto';
    videoElement.style.transitionDuration = '0.5s';
    videoElement.style.zIndex = 0;
    this.props.pinIt(enteredName);
    // WAIT FOR PROPS UPDATE
    setTimeout(() => {
      this.changeVideoPosition();
      this.changeVideoSizes();
    });
  };

  unpinVideo = () => {
    const { enteredName, zIndex } = this.props;
    const videoElement = document.getElementById(enteredName);
    this.props.setGrandParentState({ isPinned: false });
    videoElement.style.zIndex = zIndex;
    // Restore previous position and size if possible
    const { left, top, width, height } = this.getStoragedProperties(enteredName);
    videoElement.style.left = `${left}px`;
    videoElement.style.width = `${width}px`;
    videoElement.style.top = `${top}px`;
    videoElement.style.height = `${height}px`;
    this.props.unpinIt(enteredName);
    // WAIT FOR PROPS UPDATE
    setTimeout(() => {
      this.changeVideoPosition();
      this.changeVideoSizes();
    });
    // After unpin remove any interaction delay
    setTimeout(() => {
      videoElement.style.transitionDuration = '0s';
    }, 500);
  };

  closeStream = () => {
    const { enteredName } = this.props;
    const videoElement = document.getElementById(enteredName);
    videoElement.style.pointerEvents = 'none';
    if (this.props.grandParentState.isPinned) {
      this.unpinVideo();
    }
    videoElement.style.transitionDuration = '0.5s';
    videoElement.style.opacity = '0';
    if (this.props.openedStreams === 1) {
      this.closeChat(); // CLOSE CHAT WHEN NO STREAMS OPENED
    }
    setTimeout(() => {
      const newURL = window.location.hash.replace(`#${enteredName}`, '');
      if (newURL) {
        window.history.pushState('', '', newURL);
      } else {
        window.history.pushState('', '', window.location.pathname);
      }
      this.props.closeStream();
      // STORAGE CLEAR DATA
      localStorage.removeItem(`${enteredName}State`);
      localStorage.removeItem(`${enteredName}MenuState`);
      localStorage.removeItem(`${enteredName}Properties`);
    }, 500);
  };

  closeChat = () => {
    const chatElement = document.getElementById('chatBox');
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.width = `0px`;
    setTimeout(() => {
      chatElement.style.display = 'none';
    }, 500);
    document.getElementById('videoArea').style.width = '100%';
  };

  render() {
    const { menuVisibility, grandParentState } = this.props;
    let pinOrUnpinFunction = this.pinVideo;
    if (grandParentState.isPinned) {
      pinOrUnpinFunction = this.unpinVideo;
    }

    return (
      <div style={{ visibility: menuVisibility }}>
        <VideoMenuButton
          style={{ marginLeft: '2px' }}
          onClick={this.closeStream}
          onKeyDown={this.closeStream}
          role="presentation"
        >
          <div>
            <svg viewBox="0 0 32 32">
              <rect height="30" width="30" x="1" y="1" />
              <line x1="10" x2="22" y1="10" y2="22" />
              <line x1="22" x2="10" y1="10" y2="22" />
            </svg>
          </div>
        </VideoMenuButton>
        <VideoMenuButton
          style={{ marginLeft: '2px' }}
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
        </VideoMenuButton>
      </div>
    );
  };
};

MoveAndResize.propTypes = {
  menuVisibility: PropTypes.string.isRequired,
  grandParentState: PropTypes.shape({
    isPinned: PropTypes.bool
  }).isRequired,
  enteredName: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  setGrandParentState: PropTypes.func.isRequired,

  closeStream: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired,
  pinIt: PropTypes.func.isRequired,
  unpinIt: PropTypes.func.isRequired,

  openedStreams: PropTypes.number.isRequired,
  pinnedStreams: PropTypes.number.isRequired,
  pinnedStreamNames: PropTypes.string.isRequired,
  videoLayout: PropTypes.string.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    closeStream: () => {
      dispatch({ type: 'STREAM - CLOSE' });
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
};

function mapStateToProps({ openedStreams, pinnedStreams, pinnedStreamNames, videoLayout }) {
  return { openedStreams, pinnedStreams, pinnedStreamNames, videoLayout };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveAndResize);
