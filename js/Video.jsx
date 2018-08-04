import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';

import VideoWrapper from './styled/Video';
import VideoMenu from './VideoMenu';
import Loading from './Loading';
import { getWindowWidth, getWindowHeight } from './universalFunctions/windowProperties';
import getCoordinate from './universalFunctions/getCoordinate';
import { iframeEventsDisable, iframeEventsEnable } from './universalFunctions/iframeEvents';

class Video extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      channelID: props.channelName,
      channelName: props.channelName,
      isLoading: true,
      quadrant: 0,
      onRectangle: false,
      isPinned: false,
      lastX: 0,
      lastY: 0,
      lastMarginRight: getWindowWidth(),
      lastWindowHeight: getWindowHeight()
    };
    const enteredName = `${this.props.channelName}(${this.props.platform})`;
    const cachedState = JSON.parse(localStorage.getItem(`${enteredName}State`));
    if (initialState !== cachedState && cachedState) {
      initialState = { ...cachedState, isLoading: true };
    }
    this.state = initialState;
    
    let initialProperties = { left: 10, top: 10, width: 320, height: 180 };
    const cachedProperties = JSON.parse(localStorage.getItem(`${enteredName}Properties`));
    if (initialProperties !== cachedProperties && cachedProperties && !initialState.isPinned) {
      if (
        cachedProperties.left + cachedProperties.width < getWindowWidth() &&
        cachedProperties.top + cachedProperties.height < getWindowHeight()
      )
        initialProperties = cachedProperties;
    } else if (!cachedProperties) {
      localStorage.setItem(`${enteredName}Properties`, JSON.stringify(initialProperties));
    }
    this.properties = initialProperties;
  };

  componentWillMount() {
    if (this.props.platform === 'yt') {
      // get channelID - needed to find the livestream
      const API = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=';
      const APID = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&id=';
      const KEY = '&key=AIzaSyAckbMFR-zOKefEnGSWGbiESpHl81VNOYc';
      const searchChannel = this.state.channelID;
      fetch(API + searchChannel + KEY)
        .then(response => response.json())
        .then(data => {
          if (data.pageInfo.totalResults !== 0) {
            // user entered channel name
            if (data.items[0].snippet.customUrl)
              this.setState({
                channelID: data.items[0].id,
                channelName: data.items[0].snippet.customUrl
              });
            else
              this.setState({
                channelID: data.items[0].id
              });
          } else {
            // user might enter channel ID
            fetch(APID + searchChannel + KEY)
              .then(response => response.json())
              .then(data2 => {
                if (data2.pageInfo.totalResults !== 0 && data2.items[0].snippet.customUrl) {
                  // user entered channel ID
                  this.setState({
                    channelID: data2.items[0].id,
                    channelName: data2.items[0].snippet.customUrl
                  });
                }
              });
          }
        });
    }
  };

  componentDidMount() {
    const enteredName = `${this.props.channelName}(${this.props.platform})`;
    const videoElement = document.getElementById(enteredName);
    this.resize = new ResizeSensor(document.getElementById('videoArea'), () => {
      this.updateRectanglePositionOnWindowResize();
    });
    document.body.addEventListener('mousemove', this.onMove);
    document.body.addEventListener('mouseup', this.onLeave);
    document.body.addEventListener('mouseleave', this.onLeave);
    document.body.addEventListener('touchmove', this.onMove);
    document.body.addEventListener('touchend', this.onLeave);
    localStorage.setItem('openedStreams', window.location.hash);
    setTimeout(() => {
      videoElement.style.opacity = '1';
    });
    if (!this.state.isPinned)
      setTimeout(() => {
        videoElement.style.transitionDuration = '0s';
      }, 500);
  };

  shouldComponentUpdate(nextProps) {
    // Any better solution than this? - if user close any stream rebind all
    // resize sensors from others to the videoArea
    if (
      this.props.openedStreams > nextProps.openedStreams &&
      window.location.hash.includes(`${this.props.channelName}(${this.props.platform})`)
    ) {
      setTimeout(() => {
        this.resize = new ResizeSensor(document.getElementById('videoArea'), () => {
          this.updateRectanglePositionOnWindowResize();
        });
      });
    }
    return true;
  };

  componentWillUnmount() {
    this.resize.detach(); // removing 1 = removing all => usage of shouldComponentUpdate
    window.removeEventListener('resize', this.updateRectanglePositionOnWindowResize);
    document.body.removeEventListener('mousemove', this.onMove);
    document.body.removeEventListener('mouseup', this.onLeave);
    document.body.removeEventListener('mouseleave', this.onLeave);
    document.body.removeEventListener('touchmove', this.onMove);
    document.body.removeEventListener('touchend', this.onLeave);
    localStorage.setItem('openedStreams', window.location.hash);
  };

  onDown = e => {
    if (!this.state.isPinned) {
      const enteredName = `${this.props.channelName}(${this.props.platform})`;
      const x = getCoordinate(e, 'X');
      const y = getCoordinate(e, 'Y');
      this.setState({ lastX: x, lastY: y, onRectangle: true });
      iframeEventsDisable();
      if (document.getElementById(`size${enteredName}`).checked) {
        const clickQuadrant = this.checkQuadrant(x, y);
        this.setState({ quadrant: clickQuadrant });
      }
    }
  };

  onMove = e => {
    console.log(this.state);
    if (!this.state.isPinned) {
      const { onRectangle } = this.state;
      if (onRectangle) {
        const enteredName = `${this.props.channelName}(${this.props.platform})`;
        const videoElement = document.getElementById(enteredName);
        const move = document.getElementById(`move${enteredName}`).checked;
        const size = document.getElementById(`size${enteredName}`).checked;
        const { left, top, width, height } = this.getVideoProperties();
        const x = getCoordinate(e, 'X');
        const y = getCoordinate(e, 'Y');
        const mouseMoveX = this.state.lastX - x;
        const mouseMoveY = this.state.lastY - y;
        if (size) {
          // New properties - depends on quadrant
          const { newWidth, newHeight, newLeft, newTop } = this.getNewVideoProperties(
            mouseMoveX,
            videoElement
          );
          if (this.isThereAMargin(newTop, newLeft, newWidth, newHeight)) {
            return;
          }
          if (newWidth >= 320 && newWidth <= 614) {
            videoElement.style.width = `${newWidth}px`;
            videoElement.style.height = `${newHeight}px`;
            videoElement.style.left = `${newLeft}px`;
            videoElement.style.top = `${newTop}px`;
          }
        } else if (move) {
          const marginRight = this.getVideoAreaWidth() - 5;
          const newLeft = left - mouseMoveX;
          const newRight = left + width - mouseMoveX;
          // Horizontal MOVE
          if (newLeft > 5 && newRight < marginRight) {
            videoElement.style.left = `${newLeft}px`;
          }
          // Vertical MOVE
          const marginBottom = getWindowHeight() - this.getAdditionalHeight() - 5;
          const newTop = top - mouseMoveY;
          const newBottom = top + height - mouseMoveY;
          if (newTop > 5 && newBottom < marginBottom) {
            videoElement.style.top = `${newTop}px`;
          }
        }
        localStorage.setItem(`${enteredName}Properties`, JSON.stringify(this.getVideoProperties()));
        this.setState({ lastX: x, lastY: y });
      }
    }
  };

  onLeave = () => {
    if (this.state.onRectangle) {
      iframeEventsEnable();
      this.setState({ onRectangle: false });
    }
  };

  getVideoProperties = () => {
    const enteredName = `${this.props.channelName}(${this.props.platform})`;
    const videoElement = document.getElementById(enteredName);
    const left = parseInt(videoElement.style.left, 10);
    const top = parseInt(videoElement.style.top, 10);
    const width = parseInt(videoElement.style.width, 10);
    const height = parseInt(videoElement.style.height, 10);
    return { left, top, width, height };
  };

  getNewVideoProperties = mouseMoveX => {
    const { left, top, width, height } = this.getVideoProperties();
    let newWidth = width - mouseMoveX;
    let newHeight = Math.round(newWidth * 9 / 16);
    const widthDifference = Math.abs(newWidth - width);
    let heightDifference = Math.abs(newHeight - height);
    let newLeft = left;
    let newTop = top - heightDifference;
    // Second, third, fourth quadrant variables
    switch (this.state.quadrant) {
      case 2:
        newWidth = width + mouseMoveX;
        newHeight = Math.floor(newWidth * 9 / 16); // Math.floor fixes "1px movement"
        newLeft = left - widthDifference;
        heightDifference = Math.abs(newHeight - height);
        newTop = top - heightDifference;
        if (mouseMoveX <= 0) {
          newTop = top + heightDifference;
          newLeft = left + widthDifference;
        }
        break;
      case 3:
        newWidth = width + mouseMoveX;
        newHeight = Math.ceil(newWidth * 9 / 16);
        newLeft = left - widthDifference;
        newTop = top;
        if (mouseMoveX <= 0) {
          newLeft = left + widthDifference;
        }
        break;
      case 4:
        newTop = top;
        break;
      default:
        if (mouseMoveX >= 0) {
          newTop = top + heightDifference;
        }
    }
    return { newWidth, newHeight, newLeft, newTop };
  };

  getAdditionalHeight = () => {
    if (this.props.isTopBarHidden) return 0;
    return 50;
  };

  getVideoAreaWidth = () => {
    const marginRight = document.getElementById('videoArea').style.width;
    if (marginRight === '100%' || !marginRight) {
      return getWindowWidth();
    }
    return parseInt(marginRight, 10);
  };

  checkQuadrant = (x, y) => {
    const { left, top, width, height } = this.getVideoProperties();
    const additionalHeight = this.getAdditionalHeight();
    const OY = (width + window.scrollX) / 2 + left;
    const OX = (height + window.scrollY) / 2 + top + additionalHeight;
    let clickQuadrant = 0;
    if (x >= OY) {
      if (y < OX) clickQuadrant = 1;
      else clickQuadrant = 4;
    } else if (x < OY) {
      if (y < OX) clickQuadrant = 2;
      else clickQuadrant = 3;
    }
    return clickQuadrant;
  };

  isThereAMargin = (newTop, newLeft, newWidth, newHeight) => {
    const { quadrant } = this.state;
    const marginRight = this.getVideoAreaWidth() - 5;
    const marginTop = getWindowHeight() - this.getAdditionalHeight() - 5;
    // Left and right margin
    if ((quadrant === 1 || quadrant === 4) && newLeft + newWidth > marginRight) return true;
    if ((quadrant === 2 || quadrant === 3) && newLeft < 5) return true;
    // Top and bottom margin
    if ((quadrant === 1 || quadrant === 2) && newTop < 5) return true;
    if ((quadrant === 3 || quadrant === 4) && newTop + newHeight > marginTop) return true;
    return false;
  };

  updateRectanglePositionOnWindowResize = () => {
    if (!this.state.isPinned) {
      const { lastMarginRight, lastWindowHeight } = this.state;
      const enteredName = `${this.props.channelName}(${this.props.platform})`;
      const videoElement = document.getElementById(enteredName);
      const { left, top, width, height } = this.getVideoProperties();
      const marginRight = this.getVideoAreaWidth();
      const windowHeight = getWindowHeight();
      const additionalHeight = this.getAdditionalHeight();
      const widthChange = lastMarginRight - marginRight;
      // HORIZONTAL rectangle reposition
      if (width + left + 20 > lastMarginRight) {
        let newLeft = marginRight - width - 5;
        if (this.props.showChat) newLeft = marginRight - width - 5;
        if (newLeft >= 10) {
          videoElement.style.left = `${newLeft}px`;
        } else {
          // if video is too big to stay into the area - change its size
          let newVideoWidth = width - widthChange;
          if (newVideoWidth < 320) newVideoWidth = 320;
          const newVideoHeight = Math.round(newVideoWidth * 9 / 16);
          videoElement.style.left = `10px`;
          videoElement.style.width = `${newVideoWidth}px`;
          videoElement.style.height = `${newVideoHeight}px`;
        }
      }
      // VERTICAL rectangle reposition
      const rectangleBottom = top + height + additionalHeight + 10;
      if (windowHeight > 300 && rectangleBottom > lastWindowHeight) {
        videoElement.style.top = `${windowHeight - height - 5 - additionalHeight}px`;
      }
      localStorage.setItem(`${enteredName}Properties`, JSON.stringify(this.getVideoProperties()));
      this.setState({ lastWindowHeight: windowHeight, lastMarginRight: marginRight });
    }
  };

  render() {
    const { channelID, channelName, isLoading } = this.state;
    const { platform, zIndex } = this.props;
    const enteredName = `${this.props.channelName}(${platform})`;
    localStorage.setItem(`${enteredName}State`, JSON.stringify(this.state));
    let link = `https://player.twitch.tv/?&channel=${channelID}`;
    if (platform === 'yt') {
      link = `https://www.youtube.com/embed/live_stream?channel=${channelID}&autoplay=1`;
    } else if (platform === 'm') {
      link = `https://mixer.com/embed/player/${channelID}`;
    } else if (platform === 'sc') {
      link = `https://www.smashcast.tv/embed/${channelID}`;
    }
    const { left, top, width, height } = this.properties;

    return (
      <VideoWrapper 
        id={enteredName} 
        className="video" // used to disable mouse events
        onMouseDown={this.onDown}
        onTouchStart={this.onDown}
        style={{ top, left, height, width, zIndex }}
      >
        {isLoading && (
          <Loading />
        )}
        <VideoMenu
          parentState={this.state}
          channelName={channelName}
          enteredName={enteredName}
          zIndex={zIndex}
          setParentState={childData => this.setState(childData)}
        />
        <iframe
          title={`stream${enteredName}`}
          id={`stream${enteredName}`}
          src={link}
          height="100%"
          width="100%"
          scrolling="false"
          allowFullScreen="true"
          frameBorder="0"
          onLoad={() => this.setState({ isLoading: false })}
        />
      </VideoWrapper>
    );
  };
};

Video.propTypes = {
  channelName: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,

  openedStreams: PropTypes.number.isRequired,
  isTopBarHidden: PropTypes.bool.isRequired,
  showChat: PropTypes.bool.isRequired
};

function mapStateToProps({ openedStreams, isTopBarHidden, showChat }) {
  return { openedStreams, isTopBarHidden, showChat };
};

export default connect(mapStateToProps)(Video);
