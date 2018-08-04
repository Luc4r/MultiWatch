import React from 'react';
import PropTypes from 'prop-types';

import { VideoMenuMoveResizeWrapper, VideoMenuButton } from './styled/VideoMenu';
import MoveIcon from './utils/svg-icons/move';
import ResizeIcon from './utils/svg-icons/resize';

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
            <MoveIcon />
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
            <ResizeIcon />
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
