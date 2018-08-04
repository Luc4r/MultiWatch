import React from 'react';
import PropTypes from 'prop-types';

import { VideoMenuMoveResizeWrapper, VideoMenuButton } from './styled/VideoMenu';

class MoveAndResize extends React.Component {
  constructor() {
    super();
    this.lastClick = 'none';
  };

  checkboxClick = () => {
    const { lastClick } = this;
    const { enteredName } = this.props;
    const moveCheckbox = document.getElementById(`move${enteredName}`);
    const sizeCheckbox = document.getElementById(`size${enteredName}`);
    const stream = document.getElementById(`stream${enteredName}`);
    if (moveCheckbox.checked && (lastClick === 'size' || lastClick === 'none')) {
      stream.style.pointerEvents = 'none';
      this.lastClick = 'move';
      return;
    } else if (sizeCheckbox.checked && (lastClick === 'move' || lastClick === 'none')) {
      stream.style.pointerEvents = 'none';
      this.lastClick = 'size';
      return;
    }
    // UNCLICK CHECKBOX - default
    moveCheckbox.checked = false;
    sizeCheckbox.checked = false;
    stream.style.pointerEvents = 'auto';
    this.lastClick = 'none';
  };

  render() {
    const { enteredName, menuVisibility } = this.props;

    return (
      <VideoMenuMoveResizeWrapper style={{ visibility: menuVisibility }}>
        <label htmlFor={`move${enteredName}`} className="labl">
          <input
            type="radio"
            name={enteredName}
            id={`move${enteredName}`}
            onClick={this.checkboxClick}
          />
          <VideoMenuButton style={{ marginRight: '2px' }}>
            <svg viewBox="0 0 32 32" style={{ transform: 'rotate(45deg)' }}>
              <polyline points="20 6 26 6 26 12" />
              <polyline points="12 26 6 26 6 20" />
              <line x1="9" x2="23" y1="23" y2="9" />
              <polyline points="6 12 6 6 12 6" />
              <polyline points="26 20 26 26 20 26" />
              <line x1="23" x2="9" y1="23" y2="9" />
            </svg>
          </VideoMenuButton>
        </label>
        <label htmlFor={`size${enteredName}`} className="labl">
          <input
            type="radio"
            name={enteredName}
            id={`size${enteredName}`}
            onClick={this.checkboxClick}
          />
          <VideoMenuButton style={{ marginRight: '2px' }}>
            <svg viewBox="0 0 32 32">
              <rect height="30" width="30" x="1" y="1" />
              <polyline points="19 6 26 6 26 13" />
              <line x1="26" x2="19" y1="6" y2="13" />
              <polyline points="13 26 6 26 6 19" />
              <line x1="6" x2="13" y1="26" y2="19" />
            </svg>
          </VideoMenuButton>
        </label>
      </VideoMenuMoveResizeWrapper>
    );
  };
};

MoveAndResize.propTypes = {
  menuVisibility: PropTypes.string.isRequired,
  enteredName: PropTypes.string.isRequired
};

export default MoveAndResize;
