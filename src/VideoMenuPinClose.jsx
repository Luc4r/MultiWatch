import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VideoMenuButton } from './styled/VideoMenu';
import { 
  getWindowHeight, 
  getVideoAreaWidth 
} from './utils/documentProperties';
import withTooltip from './utils/withTooltip';
import CloseIcon from './utils/svg-icons/close';
import PinIcon from './utils/svg-icons/pin';

const CloseIconWithTooltip = withTooltip(CloseIcon, 'right');
const PinIconWithTooltip = withTooltip(PinIcon, 'right');

class MoveAndResize extends React.Component {
  componentDidMount() {
    const { videoElementId, pinnedStreamNames } = this.props;
    const videoElement = document.getElementById(videoElementId);
    if (pinnedStreamNames.includes(videoElementId)) {
      document.getElementById(`stream${videoElementId}`).style.pointerEvents = 'auto';
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
      }); // wait for props update
    }
    return true;
  };

  getStoragedProperties = stream => {
    let { 
      left, top, width, height 
    } = JSON.parse(localStorage.getItem(`${stream}Properties`));
    const videoAreaPadding = 5;
    if (
      left + width + videoAreaPadding > getVideoAreaWidth() || 
      top + height + videoAreaPadding > getWindowHeight()
    ) {
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
      top = `${(100 / pinnedStreams).toFixed(2) * (i - 1)}%`;
    } else if (videoLayout === 'horizontal') {
      left = `${(100 / pinnedStreams).toFixed(2) * (i - 1)}%`;
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
      height = `${(100 / pinnedStreams).toFixed(2)}%`;
    } else if (videoLayout === 'horizontal') {
      width = `${(100 / pinnedStreams).toFixed(2)}%`;
    }
    return { height, width };
  };

  changeVideoPosition = () => {
    const { pinnedStreamNames, pinnedStreams } = this.props;
    const dividedPinnedStreamNames = pinnedStreamNames.split(' ');
    for (let i = 1; i <= pinnedStreams; i += 1) {
      const { top, left } = this.getNewVideoPosition(i, pinnedStreams);
      const element = document.getElementById(dividedPinnedStreamNames[i]);
      element.style.top = top;
      element.style.left = left;
    }
  };

  changeVideoSizes = () => {
    const { pinnedStreamNames, pinnedStreams, videoLayout } = this.props;
    const dividedPinnedStreamNames = pinnedStreamNames.split(' ');
    for (let i = 1; i <= pinnedStreams; i += 1) {
      const { height, width } = this.getNewVideoSize(i, pinnedStreams);
      const element = document.getElementById(dividedPinnedStreamNames[i]);
      element.style.width = width;
      element.style.height = height;
      if (pinnedStreams === 3 && i === 3 && videoLayout === 'default') {
        element.style.width = '100%';
      }
    }
  };

  pinVideo = () => {
    const { videoElementId } = this.props;
    const videoElement = document.getElementById(videoElementId);
    if (this.props.pinnedStreams === 4) {
      this.props.addAlert(`You cannot pin more than 4 streams!`);
      return;
    }
    this.props.setGrandParentState({ isPinned: true });
    document.getElementById(`stream${videoElementId}`).style.pointerEvents = 'auto';
    videoElement.style.transitionDuration = '0.5s';
    videoElement.style.zIndex = 0;
    this.props.pinIt(videoElementId);
    setTimeout(() => {
      this.changeVideoPosition();
      this.changeVideoSizes();
    }); // wait for props update
  };

  unpinVideo = () => {
    const { videoElementId, zIndex } = this.props;
    const videoElement = document.getElementById(videoElementId);
    this.props.setGrandParentState({ isPinned: false });
    videoElement.style.zIndex = zIndex;
    // Restore previous position and size if possible
    const { left, top, width, height } = this.getStoragedProperties(videoElementId);
    videoElement.style.left = `${left}px`;
    videoElement.style.width = `${width}px`;
    videoElement.style.top = `${top}px`;
    videoElement.style.height = `${height}px`;
    this.props.unpinIt(videoElementId);
    setTimeout(() => {
      this.changeVideoPosition();
      this.changeVideoSizes();
    }); // wait for props update
    setTimeout(() => {
      videoElement.style.transitionDuration = '0s';
    }, 500); // 0.5s transition
  };

  closeStream = () => {
    const { videoElementId } = this.props;
    const videoElement = document.getElementById(videoElementId);
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
      const newURL = window.location.hash.replace(`#${videoElementId}`, '');
      if (newURL) {
        window.history.pushState('', '', newURL);
      } else {
        window.history.pushState('', '', window.location.pathname);
      }
      this.props.closeStream();
      // STORAGE CLEAR DATA
      localStorage.removeItem(`${videoElementId}State`);
      localStorage.removeItem(`${videoElementId}MenuState`);
      localStorage.removeItem(`${videoElementId}Properties`);
    }, 500); // 0.5s opacity transition
  };

  closeChat = () => {
    const chatElement = document.getElementById('chatBox');
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.width = `0px`;
    setTimeout(() => {
      chatElement.style.display = 'none';
    }, 500); // 0.5s transition
    document.getElementById('videoArea').style.width = '100%';
  };

  render() {
    const { menuVisibility, grandParentState } = this.props;
    const pinOrUnpinFunction = grandParentState.isPinned
      ? this.unpinVideo
      : this.pinVideo;

    return (
      <div style={{ visibility: menuVisibility }}>
        <VideoMenuButton
          style={{ marginLeft: '2px' }}
          onClick={this.closeStream}
          onKeyDown={this.closeStream}
          role="presentation"
        >
          <CloseIconWithTooltip>
            Close
          </CloseIconWithTooltip>
        </VideoMenuButton>
        <VideoMenuButton
          style={{ marginLeft: '2px' }}
          onClick={pinOrUnpinFunction}
          onKeyDown={pinOrUnpinFunction}
          role="presentation"
        >
          <PinIconWithTooltip>
            {grandParentState.isPinned ? 'Unpin' : 'Pin'}
          </PinIconWithTooltip>
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
  videoElementId: PropTypes.string.isRequired,
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
