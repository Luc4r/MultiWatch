import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';

import VideoWrapper from './styled/VideoWrapper';
import VideoMenu from './VideoMenu';
import Loading from './Loading';
import { getWindowWidth, getWindowHeight } from './universalFunctions/windowProperties';
import { getX, getY } from './universalFunctions/getXY';
import { iframeEventsDisable, iframeEventsEnable } from './universalFunctions/iframeEvents';

class Video extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      isLoading: true,
      opacity: 0,
      quadrant: 0,
      onRectangle: false,
      isPinned: false,
      lastX: 0,
      lastY: 0,
      lastMarginRight: getWindowWidth(),
      lastWindowHeight: getWindowHeight()
    };
    const cachedState = JSON.parse(localStorage.getItem(`${props.channelName}State`));
    if (initialState !== cachedState && cachedState !== null) {
      initialState = Object.assign({}, cachedState, { isLoading: true });
    }
    this.state = initialState;
    this.videoElement = null;
  }
  componentDidMount() {
    const videoElement = document.getElementById(this.props.channelName);
    this.resize = new ResizeSensor(document.getElementById('videoArea'), () => {
      this.updateRectanglePositionOnWindowResize();
    });
    videoElement.addEventListener('mousedown', this.onDown);
    document.body.addEventListener('mousemove', this.onMove);
    document.body.addEventListener('mouseup', this.onLeave);
    document.body.addEventListener('mouseleave', this.onLeave);
    videoElement.addEventListener('touchstart', this.onDown);
    document.body.addEventListener('touchmove', this.onMove);
    document.body.addEventListener('touchend', this.onLeave);

    localStorage.setItem('openedStreams', window.location.hash);
    setTimeout(() => {
      this.setState({ opacity: 1 });
    });
    if (this.state.isPinned === false)
      // On reloading pages with pinned videos dont do anything
      setTimeout(() => {
        document.getElementById(this.props.channelName).style.transitionDuration = '0s';
      }, 500);
  }
  shouldComponentUpdate(nextProps) {
    if (
      this.props.openedStreams > nextProps.openedStreams &&
      window.location.hash.indexOf(this.props.channelName) !== -1
    ) {
      setTimeout(() => {
        this.resize = new ResizeSensor(document.getElementById('videoArea'), () => {
          this.updateRectanglePositionOnWindowResize();
        });
      });
    }
    return true;
  }
  componentWillUnmount() {
    const videoElement = document.getElementById(this.props.channelName);
    this.resize.detach(); // removing 1 = removing all => usage of shouldComponentUpdate
    window.removeEventListener('resize', this.updateRectanglePositionOnWindowResize);
    videoElement.removeEventListener('mousedown', this.onDown);
    document.body.removeEventListener('mousemove', this.onMove);
    document.body.removeEventListener('mouseup', this.onLeave);
    document.body.removeEventListener('mouseleave', this.onLeave);
    videoElement.removeEventListener('touchstart', this.onDown);
    document.body.removeEventListener('touchmove', this.onMove);
    document.body.removeEventListener('touchend', this.onLeave);
    localStorage.setItem('openedStreams', window.location.hash);
  }

  onDown = e => {
    if (this.state.isPinned === false) {
      const x = getX(e);
      const y = getY(e);
      this.setState({ lastX: x, lastY: y, onRectangle: true });
      // Disable all video/chat events
      iframeEventsDisable();
      if (document.getElementById(`size${this.props.channelName}`).checked) {
        const video = document.getElementById(this.props.channelName);
        const additionalHeight = this.getAdditionalHeight();
        const left = parseInt(video.style.left, 10);
        const top = parseInt(video.style.top, 10);
        const width = parseInt(video.style.width, 10);
        const height = parseInt(video.style.height, 10);
        const OY = (width + window.scrollX) / 2 + left;
        const OX = (height + window.scrollY) / 2 + top + additionalHeight;
        // Check quadrant
        let clickQuadrant = 0;
        if (x > OY) {
          if (y < OX) {
            clickQuadrant = 1;
          } else {
            clickQuadrant = 4;
          }
        } else if (x < OY) {
          if (y < OX) {
            clickQuadrant = 2;
          } else {
            clickQuadrant = 3;
          }
        }
        this.setState({ quadrant: clickQuadrant });
      }
    }
  };

  onMove = e => {
    if (!this.state.isPinned) {
      const { channelName } = this.props;
      const video = document.getElementById(channelName);
      const left = parseInt(video.style.left, 10);
      const top = parseInt(video.style.top, 10);
      const width = parseInt(video.style.width, 10);
      const height = parseInt(video.style.height, 10);
      const { onRectangle } = this.state;
      const move = document.getElementById(`move${channelName}`).checked;
      const size = document.getElementById(`size${channelName}`).checked;

      if (onRectangle === true) {
        const windowHeight = getWindowHeight();
        const marginRight = this.getVideoAreaWidth();
        const additionalHeight = this.getAdditionalHeight();
        // X VARIABLES
        const { lastX } = this.state;
        const x = getX(e);
        const mouseMoveX = lastX - x;
        const rectangleLeft = left + window.scrollX;
        // Y VARIABLES
        const { lastY } = this.state;
        const y = getY(e);
        const mouseMoveY = lastY - y;
        const rectangleTop = top + window.scrollY;
        // CHANGE SIZE
        if (size === true) {
          // QUADRANTS
          const { newWidth, newHeight, newLeft, newTop } = this.getVideoProperties(
            mouseMoveX,
            rectangleLeft,
            width,
            rectangleTop,
            height
          );
          // MARGINS
          if (this.isThereAMargin(newTop, newLeft, newWidth, newHeight) === true) {
            return;
          }
          // MIN/MAX WIDTH (height depends on width - 16:9 ratio)
          if (newWidth >= 320 && newWidth <= 614) {
            video.style.width = `${newWidth}px`;
            video.style.height = `${newHeight}px`;
            video.style.left = `${newLeft}px`;
            video.style.top = `${newTop}px`;
            this.setState({ lastX: x, lastY: y });
          }
        }
        // MOVE ELEMENT
        if (move === true) {
          const newLeft = rectangleLeft - mouseMoveX;
          const newTop = rectangleTop - mouseMoveY;
          // Horizontal MOVE
          if (newLeft > 5 && rectangleLeft + width - mouseMoveX < marginRight - 5) {
            video.style.left = `${newLeft}px`;
          }
          // Vertical MOVE
          if (
            newTop > 5 &&
            rectangleTop + height - mouseMoveY < windowHeight - 5 - additionalHeight
          ) {
            video.style.top = `${newTop}px`;
          }
          this.setState({ lastX: x, lastY: y });
        }
      }
    }
  };

  onLeave = () => {
    iframeEventsEnable();
    this.setState({ onRectangle: false });
  };

  getVideoProperties = (mouseMoveX, rectangleLeft, width, rectangleTop, height) => {
    let newWidth = width - mouseMoveX;
    let newHeight = Math.round(newWidth * 9 / 16);
    const widthDifference = Math.abs(newWidth - width);
    let heightDifference = Math.abs(newHeight - height);
    let newLeft = rectangleLeft;
    let newTop = rectangleTop - heightDifference;
    // Second, third, fourth quadrant variables
    switch (this.state.quadrant) {
      case 2:
        newWidth = width + mouseMoveX;
        newLeft = rectangleLeft - widthDifference;
        newHeight = Math.floor(newWidth * 9 / 16); // Math.floor fixes "1px movement"
        heightDifference = Math.abs(newHeight - height);
        newTop = rectangleTop - heightDifference;
        if (mouseMoveX <= 0) {
          newTop = rectangleTop + heightDifference;
          newLeft = rectangleLeft + widthDifference;
        }
        break;
      case 3:
        newWidth = width + mouseMoveX;
        newHeight = Math.ceil(newWidth * 9 / 16);
        newLeft = rectangleLeft - widthDifference;
        newTop = rectangleTop;
        if (mouseMoveX <= 0) {
          newLeft = rectangleLeft + widthDifference;
        }
        break;
      case 4:
        newTop = rectangleTop;
        break;
      default:
        if (mouseMoveX >= 0) {
          newTop = rectangleTop + heightDifference;
        }
    }
    return { newWidth, newHeight, newLeft, newTop };
  };

  getAdditionalHeight = () => {
    if (this.props.isTopBarHidden === true) {
      return 0;
    }
    return 50;
  };

  getVideoAreaWidth = () => {
    const marginRight = document.getElementById('videoArea').style.width;
    if (marginRight === '100%') {
      return getWindowWidth();
    }
    return parseInt(marginRight, 10);
  };

  isThereAMargin = (newTop, newLeft, newWidth, newHeight) => {
    const { quadrant } = this.state;
    const marginRight = this.getVideoAreaWidth();
    const marginTop = getWindowHeight() - this.getAdditionalHeight();
    // Left and right margin
    if ((quadrant === 1 || quadrant === 4) && newLeft + newWidth + 5 > marginRight) {
      return true;
    }
    if ((quadrant === 2 || quadrant === 3) && newLeft < 5) {
      return true;
    }
    // Top and bottom margin
    if ((quadrant === 1 || quadrant === 2) && newTop < 5) {
      return true;
    }
    if ((quadrant === 3 || quadrant === 4) && newTop + newHeight + 5 > marginTop) {
      return true;
    }
    return false;
  };

  updateRectanglePositionOnWindowResize = () => {
    if (this.state.isPinned === false) {
      const video = document.getElementById(this.props.channelName);
      const { lastMarginRight, lastWindowHeight } = this.state;
      const marginRight = this.getVideoAreaWidth();
      const windowHeight = getWindowHeight();
      const additionalHeight = this.getAdditionalHeight();
      const left = parseInt(video.style.left, 10);
      const top = parseInt(video.style.top, 10);
      const width = parseInt(video.style.width, 10);
      const height = parseInt(video.style.height, 10);
      const widthChange = lastMarginRight - marginRight;
      // HORIZONTAL rectangle reposition
      if (width + left + 20 > lastMarginRight) {
        let newLeft = marginRight - width - 5;
        if (this.props.showChat === true) {
          newLeft = marginRight - width - 5;
        }
        if (newLeft >= 10) {
          video.style.left = `${newLeft}px`;
        } else {
          // if video is too big to stay into the area - change its size
          let newVideoWidth = width - widthChange;
          if (newVideoWidth < 320) {
            newVideoWidth = 320;
          }
          const newVideoHeight = newVideoWidth * 9 / 16;
          video.style.left = `10px`;
          video.style.width = `${newVideoWidth}px`;
          video.style.height = `${newVideoHeight}px`;
        }
      }
      // VERTICAL rectangle reposition
      if (
        windowHeight > 300 &&
        (top + height + 10 + additionalHeight > lastWindowHeight ||
          top + height + 10 + additionalHeight > windowHeight)
      ) {
        video.style.top = `${windowHeight - height - 5 - additionalHeight}px`;
      }
      this.setState({ lastWindowHeight: windowHeight, lastMarginRight: marginRight });
      setTimeout(() => {
        video.style.transitionDuration = '0s';
      }, 400);
    }
  };

  render() {
    const { isLoading, opacity } = this.state;
    const { channelName, zIndex } = this.props;
    localStorage.setItem(`${channelName}State`, JSON.stringify(this.state));

    return (
      <VideoWrapper
        id={channelName}
        className="video"
        style={{
          top: 10,
          left: 10,
          width: 320,
          height: 180,
          opacity,
          zIndex
        }}
      >
        {isLoading === true && <Loading />}
        <VideoMenu
          parentState={this.state}
          channelName={channelName}
          zIndex={zIndex}
          setParentState={childData => this.setState(childData)}
        />
        <iframe
          title={channelName}
          id={`stream${channelName}`}
          ref={i => {
            this.iframe = i;
          }}
          src={`https://player.twitch.tv/?&channel=${channelName}`}
          height="100%"
          width="100%"
          scrolling="false"
          allowFullScreen="true"
          onLoad={() => this.setState({ isLoading: false })}
        />
      </VideoWrapper>
    );
  }
}

Video.propTypes = {
  channelName: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  isTopBarHidden: PropTypes.bool.isRequired,
  showChat: PropTypes.bool.isRequired,
  openedStreams: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    isTopBarHidden: state.isTopBarHidden,
    showChat: state.showChat,
    openedStreams: state.openedStreams
  };
}

export default connect(mapStateToProps)(Video);
