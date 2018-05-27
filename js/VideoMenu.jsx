import React from 'react';
import PropTypes from 'prop-types';

import MoveResizeButtons from './VideoMenuMoveResize';
import PinCloseButtons from './VideoMenuPinClose';
import { VideoMenuWrapper } from './styled/VideoMenu';

class VideoMenu extends React.Component {
  constructor(props) {
    super();
    let initialState = {
      menuOpacity: 1,
      menuVisibility: 'visible'
    };
    const cachedState = JSON.parse(localStorage.getItem(`${props.enteredName}MenuState`));
    if (initialState !== cachedState && cachedState !== null) {
      initialState = cachedState;
    }
    this.state = initialState;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.parentState.isPinned !== nextProps.parentState.isPinned) return true;
    if (this.state.menuVisibility !== nextState.menuVisibility) return true;
    if (this.props.channelName !== nextProps.channelName) return true;
    return false;
  }

  changeMenuVisibility = () => {
    if (this.state.menuOpacity === 1) {
      const { enteredName } = this.props;
      document.getElementById(`stream${enteredName}`).style.pointerEvents = 'auto';
      const moveCheckbox = document.getElementById(`move${enteredName}`);
      const sizeCheckbox = document.getElementById(`size${enteredName}`);
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
    const { menuOpacity, menuVisibility } = this.state;
    const { channelName, enteredName, parentState } = this.props;

    let spanStyle = { width: 'calc(100% - 168px)' };
    if (parentState.isPinned) {
      spanStyle = { width: 'calc(100% - 84px)' };
    }
    localStorage.setItem(`${enteredName}MenuState`, JSON.stringify(this.state));

    return (
      <VideoMenuWrapper style={{ opacity: menuOpacity, zIndex: 150 }}>
        <div id="barBackground">
          {!parentState.isPinned && (
            <MoveResizeButtons menuVisibility={menuVisibility} enteredName={enteredName} />
          )}
          <span
            style={spanStyle}
            onClick={this.changeMenuVisibility}
            onKeyDown={this.changeMenuVisibility}
            role="presentation"
          >
            {channelName.charAt(0).toUpperCase() + channelName.slice(1)}
          </span>
          <PinCloseButtons
            menuVisibility={menuVisibility}
            grandParentState={parentState}
            enteredName={enteredName}
            zIndex={this.props.zIndex}
            setGrandParentState={this.props.setParentState}
          />
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
  enteredName: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  setParentState: PropTypes.func.isRequired
};

export default VideoMenu;
