import React from 'react';
import PropTypes from 'prop-types';

import MoveResizeButtons from './VideoMenuMoveResize';
import PinCloseButtons from './VideoMenuPinClose';
import { 
  VideoMenuWrapper, 
  VideoMenuBackground,
  VideoMenuChannelNameWrapper
} from './styled/VideoMenu';

class VideoMenu extends React.Component {
  constructor(props) {
    super();
    let initialState = {
      menuOpacity: 1,
      menuVisibility: 'visible'
    };
    const cachedState = JSON.parse(localStorage.getItem(`${props.videoElementId}MenuState`));
    if (initialState !== cachedState && cachedState !== null) {
      initialState = cachedState;
    }
    this.state = initialState;
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.parentState.isPinned !== nextProps.parentState.isPinned) {
      return true;
    }
    if (this.state !== nextState) {
      return true;
    }
    if (this.props.channelName !== nextProps.channelName) {
      return true;
    } 
    return false;
  };

  toggleMenuVisibility = () => {
    if (this.state.menuOpacity === 1) {
      const { videoElementId } = this.props;
      document.getElementById(`stream${videoElementId}`).style.pointerEvents = 'auto';
      const moveCheckbox = document.getElementById(`move${videoElementId}`);
      const sizeCheckbox = document.getElementById(`size${videoElementId}`);
      if (!this.props.parentState.isPinned) {
        moveCheckbox.checked = false;
        sizeCheckbox.checked = false;
      }
      this.setState({ menuOpacity: 0, menuVisibility: 'hidden' });
    } else {
      this.setState({ menuOpacity: 1, menuVisibility: 'visible' });
    }
  };

  render() {
    const { channelName, videoElementId, parentState } = this.props;
    const { menuOpacity, menuVisibility } = this.state;
    const spanStyle = parentState.isPinned
      ? { width: 'calc(100% - 84px)' }
      : { width: 'calc(100% - 168px)' };
    localStorage.setItem(`${videoElementId}MenuState`, JSON.stringify(this.state));

    return (
      <VideoMenuWrapper style={{ opacity: menuOpacity }}>
        <VideoMenuBackground>
          {!parentState.isPinned && (
            <MoveResizeButtons 
              menuVisibility={menuVisibility} 
              videoElementId={videoElementId} 
            />
          )}
          <VideoMenuChannelNameWrapper
            style={spanStyle}
            onClick={this.toggleMenuVisibility}
            role="presentation"
          >
            {channelName.charAt(0).toUpperCase() + channelName.slice(1)}
          </VideoMenuChannelNameWrapper>
          <PinCloseButtons
            menuVisibility={menuVisibility}
            grandParentState={parentState}
            videoElementId={videoElementId}
            zIndex={this.props.zIndex}
            setGrandParentState={this.props.setParentState}
          />
        </VideoMenuBackground>
      </VideoMenuWrapper>
    );
  };
};

VideoMenu.propTypes = {
  parentState: PropTypes.shape({
    isPinned: PropTypes.bool
  }).isRequired,
  channelName: PropTypes.string.isRequired,
  videoElementId: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  setParentState: PropTypes.func.isRequired
};

export default VideoMenu;
