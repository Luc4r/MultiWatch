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
    const { videoElementId } = this.props;
    const moveCheckbox = document.getElementById(`move${videoElementId}`);
    const sizeCheckbox = document.getElementById(`size${videoElementId}`);
    const stream = document.getElementById(`stream${videoElementId}`);
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
    const { videoElementId, menuVisibility } = this.props;

    return (
      <VideoMenuMoveResizeWrapper style={{ visibility: menuVisibility }}>
        <label htmlFor={`move${videoElementId}`} className="labl">
          <input
            type="radio"
            name={videoElementId}
            id={`move${videoElementId}`}
            onClick={this.checkboxClick}
          />
          <VideoMenuButton style={{ marginRight: '2px' }}>
            <MoveIcon />
          </VideoMenuButton>
        </label>
        <label htmlFor={`size${videoElementId}`} className="labl">
          <input
            type="radio"
            name={videoElementId}
            id={`size${videoElementId}`}
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
  videoElementId: PropTypes.string.isRequired
};

export default MoveAndResize;
