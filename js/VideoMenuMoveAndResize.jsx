import React from 'react';
import PropTypes from 'prop-types';

import VideoMenuMoveAndResizeWrapper from './styled/VideoMenuMoveAndResizeWrapper';
import { VidMenuButton } from './styled/VideoMenuWrapper';

class MoveAndResize extends React.Component {
  constructor() {
    super();
    this.state = {
      lastClick: 'none'
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.menuVisibility !== nextProps.menuVisibility) {
      return true;
    }
    return false;
  }

  checkboxClick = () => {
    const moveCheckbox = document.getElementById(`move${this.props.channelName}`);
    const sizeCheckbox = document.getElementById(`size${this.props.channelName}`);
    const stream = document.getElementById(`stream${this.props.channelName}`);
    const { lastClick } = this.state;
    if (moveCheckbox.checked && (lastClick === 'size' || lastClick === 'none')) {
      setTimeout(() => {
        stream.style.pointerEvents = 'none';
      }, 50); // delay required - functions in Video component are called first
      this.setState({ lastClick: 'move' });
      return;
    } else if (sizeCheckbox.checked && (lastClick === 'move' || lastClick === 'none')) {
      setTimeout(() => {
        stream.style.pointerEvents = 'none';
      }, 50); // delay required - functions in Video component are called first
      this.setState({ lastClick: 'size' });
      return;
    }
    // UNCLICK CHECKBOX - default
    moveCheckbox.checked = false;
    sizeCheckbox.checked = false;
    setTimeout(() => {
      stream.style.pointerEvents = 'auto';
    }, 50); // delay required - functions in Video component are called first
    this.setState({ lastClick: 'none' });
  };

  render() {
    return (
      <VideoMenuMoveAndResizeWrapper style={{ visibility: this.props.menuVisibility }}>
        <label htmlFor={`move${this.props.channelName}`} className="labl">
          <input
            type="radio"
            name={this.props.channelName}
            id={`move${this.props.channelName}`}
            onClick={this.checkboxClick}
          />
          <VidMenuButton style={{ marginRight: '2px' }}>
            <svg viewBox="0 0 32 32" style={{ transform: 'rotate(45deg)' }}>
              <polyline points="20 6 26 6 26 12" />
              <polyline points="12 26 6 26 6 20" />
              <line x1="9" x2="23" y1="23" y2="9" />
              <polyline points="6 12 6 6 12 6" />
              <polyline points="26 20 26 26 20 26" />
              <line x1="23" x2="9" y1="23" y2="9" />
            </svg>
          </VidMenuButton>
        </label>
        <label htmlFor={`size${this.props.channelName}`} className="labl">
          <input
            type="radio"
            name={this.props.channelName}
            id={`size${this.props.channelName}`}
            onClick={this.checkboxClick}
          />
          <VidMenuButton style={{ marginRight: '2px' }}>
            <svg viewBox="0 0 32 32">
              <rect height="30" width="30" x="1" y="1" />
              <polyline points="19 6 26 6 26 13" />
              <line x1="26" x2="19" y1="6" y2="13" />
              <polyline points="13 26 6 26 6 19" />
              <line x1="6" x2="13" y1="26" y2="19" />
            </svg>
          </VidMenuButton>
        </label>
      </VideoMenuMoveAndResizeWrapper>
    );
  }
}

MoveAndResize.propTypes = {
  menuVisibility: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired
};

export default MoveAndResize;
