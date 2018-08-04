import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  TopBarOptionsSelectWrapper, 
  VideosLayoutTitleWrapper,
  VideosLayoutOption,
  VideosLayoutDescription,
  VideosLayoutCurrentWrapper
} from './styled/TopBarOptionsMenu';

class TopBarOptionsLayoutSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      isDropdownHidden: true
    };
  };

  handleClick = e => {
    const newValue = e.target.id;
    if (newValue !== this.props.videoLayout) {
      this.props.changeLayout(newValue);
    } 
  };

  toggleDropdownVisibility = () => {
    const dropElement = document.getElementById('layoutDropdown');
    if (dropElement.style.visibility !== 'visible') {
      dropElement.style.visibility = 'visible';
      dropElement.style.opacity = '1';
      dropElement.style.height = '100px';
      this.setState({ isDropdownHidden: false });
    } else {
      dropElement.style.visibility = 'hidden';
      dropElement.style.opacity = '0';
      dropElement.style.height = '0px';
      this.setState({ isDropdownHidden: true });
    }
  };

  render() {
    const { videoLayout } = this.props;

    return (
      <TopBarOptionsSelectWrapper 
        onClick={this.toggleDropdownVisibility}
        onKeyPress={this.toggleDropdownVisibility}
      >
        <VideosLayoutTitleWrapper>
          Change videos layout
          <svg viewBox="0 0 32 32">
            <polygon points="10 10 22 10 16 22 10 10" />
          </svg>
        </VideosLayoutTitleWrapper>

        {this.state.isDropdownHidden === true && (
          <VideosLayoutCurrentWrapper>
            Current: {videoLayout.slice(0, 1).toUpperCase() + videoLayout.slice(1)}
          </VideosLayoutCurrentWrapper>
        )}
        <div id="layoutDropdown">
          <VideosLayoutOption htmlFor="default">
            <input
              type="radio"
              name="layout"
              id="default"
              onClick={this.handleClick}
              defaultChecked={videoLayout === 'default'}
            />
            <VideosLayoutDescription>Default (Z-Shape)</VideosLayoutDescription>
          </VideosLayoutOption>
          <VideosLayoutOption htmlFor="horizontal">
            <input
              type="radio"
              name="layout"
              id="horizontal"
              onClick={this.handleClick}
              defaultChecked={videoLayout === 'horizontal'}
            />
            <VideosLayoutDescription>Horizontal</VideosLayoutDescription>
          </VideosLayoutOption>
          <VideosLayoutOption htmlFor="vertical">
            <input
              type="radio"
              name="layout"
              id="vertical"
              onClick={this.handleClick}
              defaultChecked={videoLayout === 'vertical'}
            />
            <VideosLayoutDescription>Vertical</VideosLayoutDescription>
          </VideosLayoutOption>
        </div>
      </TopBarOptionsSelectWrapper>
    );
  };
};

TopBarOptionsLayoutSelect.propTypes = {
  videoLayout: PropTypes.string.isRequired,
  changeLayout: PropTypes.func.isRequired
};

function mapStateToProps({ videoLayout }) {
  return { videoLayout };
};

function mapDispatchToProps(dispatch) {
  return {
    changeLayout: newLayout => {
      dispatch({ type: 'STREAM - CHANGE LAYOUT', newLayout });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBarOptionsLayoutSelect);
