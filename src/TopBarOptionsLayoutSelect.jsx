import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  TopBarOptionsSelectWrapper, 
  VideosLayoutTitleWrapper,
  VideosLayoutDropdownWrapper,
  VideosLayoutOption,
  VideosLayoutDescription,
  VideosLayoutCurrentWrapper
} from './styled/TopBarOptionsMenu';
import ArrowDownIcon from './utils/svg-icons/arrowDown';

class TopBarOptionsLayoutSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      isDropdownHidden: true
    };
  };

  handleClick = e => {
    const newVideoLayout = e.target.id;
    if (newVideoLayout !== this.props.videoLayout) {
      this.props.changeLayout(newVideoLayout);
    }
    this.toggleDropdownVisibility(); 
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
    const { isDropdownHidden } = this.state;

    return (
      <TopBarOptionsSelectWrapper 
        onClick={this.toggleDropdownVisibility}
        onKeyPress={this.toggleDropdownVisibility}
      >
        <VideosLayoutTitleWrapper>
          Change videos layout
          <ArrowDownIcon />
        </VideosLayoutTitleWrapper>

        {isDropdownHidden === true && (
          <VideosLayoutCurrentWrapper>
            Current: {videoLayout.slice(0, 1).toUpperCase() + videoLayout.slice(1)}
          </VideosLayoutCurrentWrapper>
        )}
        <VideosLayoutDropdownWrapper id="layoutDropdown">
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
        </VideosLayoutDropdownWrapper>
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
