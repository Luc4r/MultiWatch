import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';

import VideoMenu from './VideoMenu';
import Loading from './Loading';
import { 
  getWindowWidth, 
  getWindowHeight, 
  getVideoAreaWidth 
} from './utils/documentProperties';
import getCoordinate from './utils/getCoordinate';
import getAdditionalHeight from './utils/getAdditionalHeight';
import getChannelIDAndName from './utils/youtubeAPI';
import { iframeEventsDisable, iframeEventsEnable } from './utils/iframeEvents';
import getElementProperties from './utils/getElementProperties';
import VideoWrapper from './styled/Video';

class Video extends React.Component {
  constructor(props) {
    super(props);
    const videoElementId = this.getVideoElementId();
    const initialState = {
      channelID: props.channelName,
      channelName: props.channelName,
      isLoading: true,
      isPinned: false
    };
    const cachedState = JSON.parse(localStorage.getItem(`${videoElementId}State`));
    this.state = (cachedState && initialState !== cachedState)
      ? { ...cachedState, isLoading: true }
      : initialState;
    
    const initialProperties = { left: 10, top: 10, width: 320, height: 180 };
    const cachedProperties = JSON.parse(localStorage.getItem(`${videoElementId}Properties`));
    this.properties = (
      cachedProperties && initialProperties !== cachedProperties && !this.state.isPinned
    ) ? ((
        cachedProperties.left + cachedProperties.width < getWindowWidth() &&
        cachedProperties.top + cachedProperties.height < getWindowHeight()
      ) && cachedProperties
    ) : initialProperties;

    this.lastValues = {
      lastX: 0,
      lastY: 0,
      lastMarginRight: getWindowWidth(),
      lastWindowHeight: getWindowHeight()
    };
    this.quadrant = 0;
    this.onVideo = false;
  };

  async componentWillMount() {
    if (this.props.platform !== 'yt') {
      return;
    }

    const channelData = await getChannelIDAndName(this.state.channelID);
    this.setState({ ...channelData, isLoading: false });
  };

  componentDidMount() {
    const videoElementId = this.getVideoElementId();
    const videoElement = document.getElementById(videoElementId);
    this.resize = new ResizeSensor(document.getElementById('videoArea'), () => {
      this.updateVideoPositionOnWindowResize();
    });
    document.body.addEventListener('mousemove', this.onMove);
    document.body.addEventListener('mouseup', this.onLeave);
    document.body.addEventListener('mouseleave', this.onLeave);
    document.body.addEventListener('touchmove', this.onMove);
    document.body.addEventListener('touchend', this.onLeave);
    localStorage.setItem('openedStreams', window.location.hash);
    setTimeout(() => {
      videoElement.style.opacity = '1';
    }); // wait for render
    if (!this.state.isPinned)
      setTimeout(() => {
        videoElement.style.transitionDuration = '0s';
      }, 500);  // 0.5s opacity transition
  };

  shouldComponentUpdate(nextProps) {
    const videoElementId = this.getVideoElementId();
    if (
      this.props.openedStreams > nextProps.openedStreams &&
      window.location.hash.includes(videoElementId)
    ) {
      setTimeout(() => {
        this.resize = new ResizeSensor(
          document.getElementById('videoArea'), 
          this.updateVideoPositionOnWindowResize
        );
      }); // do it after detach
    }
    return true;
  };

  componentWillUnmount() {
    this.resize.detach(); // removing 1 = removing all => usage of shouldComponentUpdate
    window.removeEventListener('resize', this.updateVideoPositionOnWindowResize);
    document.body.removeEventListener('mousemove', this.onMove);
    document.body.removeEventListener('mouseup', this.onLeave);
    document.body.removeEventListener('mouseleave', this.onLeave);
    document.body.removeEventListener('touchmove', this.onMove);
    document.body.removeEventListener('touchend', this.onLeave);
    localStorage.setItem('openedStreams', window.location.hash);
  };

  onDown = e => {
    if (this.state.isPinned) {
      return;
    }
    const videoElementId = this.getVideoElementId();
    const x = getCoordinate(e, 'X');
    const y = getCoordinate(e, 'Y');
    this.lastValues = { ...this.lastValues, lastX: x, lastY: y };
    this.onVideo = true;
    iframeEventsDisable();
    if (document.getElementById(`size${videoElementId}`).checked) {
      const clickQuadrant = this.checkQuadrant(x, y);
      this.quadrant = clickQuadrant;
    }
  };

  onMove = e => {
    if (this.state.isPinned || !this.onVideo) {
      return;
    }
    const { lastX, lastY } = this.lastValues;
    const videoElementId = this.getVideoElementId();
    const move = document.getElementById(`move${videoElementId}`).checked;
    const resize = document.getElementById(`size${videoElementId}`).checked;
    const x = getCoordinate(e, 'X');
    const y = getCoordinate(e, 'Y');
    const mouseMoveX = lastX - x;
    const mouseMoveY = lastY - y;
    if (resize) {
      this.resizeVideo(mouseMoveX);
    } else if (move) {
      this.moveVideo(mouseMoveX, mouseMoveY);
    }
    this.properties = getElementProperties({ 
      id: videoElementId,
      properties: ["left", "top", "width", "height"],
      parseToInt: true
    });
    this.lastValues = { ...this.lastValues, lastX: x, lastY: y };
  };

  onLeave = () => {
    if (this.onVideo) {
      iframeEventsEnable();
      this.onVideo = false;
    }
  };

  getVideoElementId = () => `${this.props.channelName}(${this.props.platform})`;

  getNewVideoPropertiesOnResize = (mouseMoveX) => {
    const { left, top, width, height } = getElementProperties({ 
      id: this.getVideoElementId(),
      properties: ["left", "top", "width", "height"],
      parseToInt: true
    });
    let newWidth = width - mouseMoveX;
    let newHeight = Math.round(newWidth * 9 / 16);
    const widthDifference = Math.abs(newWidth - width);
    let heightDifference = Math.abs(newHeight - height);
    let newLeft = left;
    let newTop = (mouseMoveX < 0)
      ? top - heightDifference
      : top + heightDifference;
    switch (this.quadrant) {
      case 2:
        newWidth = width + mouseMoveX;
        newHeight = Math.floor(newWidth * 9 / 16); // Math.floor fixes "1px movement"
        heightDifference = Math.abs(newHeight - height);
        newLeft = (mouseMoveX > 0) 
          ? left - widthDifference
          : left + widthDifference;
        newTop = (mouseMoveX > 0)
          ? top - heightDifference
          : top + heightDifference;
        break;
      case 3:
        newWidth = width + mouseMoveX;
        newHeight = Math.ceil(newWidth * 9 / 16);
        newLeft = (mouseMoveX > 0)
          ? left - widthDifference
          : left + widthDifference;
        newTop = top;
        break;
      case 4:
        newTop = top;
        break;
      default:
    }
    return { newWidth, newHeight, newLeft, newTop };
  };

  resizeVideo = (mouseMoveX) => {
    const videoElementId = this.getVideoElementId();
    const videoElement = document.getElementById(videoElementId);
    const { 
      newWidth, 
      newHeight, 
      newLeft, 
      newTop 
    } = this.getNewVideoPropertiesOnResize(mouseMoveX);

    if (this.isThereAMargin(newTop, newLeft, newWidth, newHeight)) {
      return;
    }
    
    if (newWidth >= 320 && newWidth <= 614) {
      videoElement.style.width = `${newWidth}px`;
      videoElement.style.height = `${newHeight}px`;
      videoElement.style.left = `${newLeft}px`;
      videoElement.style.top = `${newTop}px`;
    }
  };

  moveVideo = (mouseMoveX, mouseMoveY) => {
    const videoElementId = this.getVideoElementId();
    const videoElement = document.getElementById(videoElementId);
    const { left, top, width, height } = getElementProperties({ 
      id: videoElementId,
      properties: ["left", "top", "width", "height"],
      parseToInt: true
    });
    const newLeft = left - mouseMoveX;
    const newTop = top - mouseMoveY;
    const margin = this.isThereAMargin(newTop, newLeft, width, height);
    if (!margin.includes("horizontal")) {
      videoElement.style.left = `${newLeft}px`
    }
    if (!margin.includes("vertical")) {
      videoElement.style.top = `${newTop}px`;
    }
  };

  checkQuadrant = (x, y) => {
    const { left, top, width, height } = getElementProperties({ 
      id: this.getVideoElementId(),
      properties: ["left", "top", "width", "height"],
      parseToInt: true
    });
    const additionalHeight = getAdditionalHeight(this.props.isTopBarHidden);
    const OY = (width + window.scrollX) / 2 + left;
    const OX = (height + window.scrollY) / 2 + top + additionalHeight;
    let clickQuadrant = 0;
    if (x >= OY) {
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
    return clickQuadrant;
  };

  isThereAMargin = (newTop, newLeft, newWidth, newHeight) => {
    const videoAreaPadding = 5;
    const additionalHeight = getAdditionalHeight(this.props.isTopBarHidden);
    const marginRight = getVideoAreaWidth() - videoAreaPadding;
    const marginTop = getWindowHeight() - additionalHeight - videoAreaPadding;
    let margin = "";
    if (newLeft < videoAreaPadding || newLeft + newWidth > marginRight) {
      margin += "horizontal";
    }
    if (newTop < videoAreaPadding || newTop + newHeight > marginTop) {
      margin += "vertical";
    }
    return margin;
  };

  updateVideoPositionOnWindowResize = () => {
    if (this.state.isPinned) {
      return;
    }
    const videoAreaPadding = 5;
    const { lastMarginRight, lastWindowHeight } = this.lastValues;
    const videoElementId = this.getVideoElementId()
    const videoElement = document.getElementById(videoElementId);
    const { left, top, width, height } = getElementProperties({ 
      id: videoElementId,
      properties: ["left", "top", "width", "height"],
      parseToInt: true
    });
    const marginRight = getVideoAreaWidth();
    const windowHeight = getWindowHeight();
    const additionalHeight = getAdditionalHeight(this.props.isTopBarHidden);
    const widthChange = lastMarginRight - marginRight;
    // HORIZONTAL video reposition
    const videoRight = width + left + 20;
    if (videoRight > lastMarginRight || videoRight > marginRight) {
      const newLeft = marginRight - width - videoAreaPadding;
      if (newLeft >= 10) {
        videoElement.style.left = `${newLeft}px`;
      } else {
        // if video is too big to stay into the area - change its size
        let newVideoWidth = width - widthChange;
        if (newVideoWidth < 320) {
          newVideoWidth = 320;
        }
        const newVideoHeight = Math.round(newVideoWidth * 9 / 16);
        videoElement.style.left = `10px`;
        videoElement.style.width = `${newVideoWidth}px`;
        videoElement.style.height = `${newVideoHeight}px`;
      }
    }
    // VERTICAL video reposition
    const videoBottom = top + height + additionalHeight + 20;
    if (windowHeight > 300 && videoBottom > lastWindowHeight) {
      const newTop = windowHeight - height - videoAreaPadding - additionalHeight;
      videoElement.style.top = `${newTop}px`;
    }
    localStorage.setItem(`${videoElementId}Properties`, JSON.stringify(
      getElementProperties({ 
        id: videoElementId,
        properties: ["left", "top", "width", "height"],
        parseToInt: true
      })
    ));
    this.lastValues = { 
      ...this.lastValues, 
      lastWindowHeight: windowHeight, 
      lastMarginRight: marginRight 
    };
  };

  render() {
    const { platform, zIndex } = this.props;
    const { channelID, channelName, isLoading } = this.state;
    const { left, top, width, height } = this.properties;
    const videoElementId = this.getVideoElementId();

    localStorage.setItem(`${videoElementId}State`, JSON.stringify(this.state));
    localStorage.setItem(`${videoElementId}Properties`, JSON.stringify(this.properties));
    // Platforms:
    const youtube = 'yt';
    const mixer = 'm';
    const smashcast = 'sc';
    let link = `https://player.twitch.tv/?&channel=${channelID}`;
    if (platform === youtube) {
      link = `https://www.youtube.com/embed/live_stream?channel=${channelID}&autoplay=1`;
    } else if (platform === mixer) {
      link = `https://mixer.com/embed/player/${channelID}`;
    } else if (platform === smashcast) {
      link = `https://www.smashcast.tv/embed/${channelID}`;
    }

    return (
      <VideoWrapper 
        id={videoElementId} 
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
          videoElementId={videoElementId}
          zIndex={zIndex}
          setParentState={childData => this.setState(childData)}
        />
        <iframe
          title={`stream${videoElementId}`}
          id={`stream${videoElementId}`}
          src={link}
          height="100%"
          width="100%"
          scrolling="false"
          allowFullScreen="true"
          frameBorder="0"
          onLoad={() => platform !== 'yt' && this.setState({ isLoading: false })}
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
  isTopBarHidden: PropTypes.bool.isRequired
};

function mapStateToProps({ openedStreams, isTopBarHidden }) {
  return { openedStreams, isTopBarHidden };
};

export default connect(mapStateToProps)(Video);
