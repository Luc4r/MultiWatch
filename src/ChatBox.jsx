import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Chat from './Chat';
import Loading from './Loading';
import { getWindowWidth } from './utils/documentProperties';
import getCoordinate from './utils/getCoordinate';
import { iframeEventsDisable, iframeEventsEnable } from './utils/iframeEvents';
import getStreamNames from './utils/getStreamNames';
import withTooltip from './utils/withTooltip';
import HelpIcon from './utils/svg-icons/help';
import { 
  ChatBoxWrapper,
  ChatTopBarWrapper,
  ChatSelectWrapper,
  ChatChangeWidthWrapper,
  ChatChangeWidthLine
} from './styled/ChatBox';
import { DividerWrapper } from './styled/Tooltip';

const HelpWrapper = withTooltip(HelpIcon, 'right');
const HelpWrapperStyle = {
  margin: '0 4px 0 auto',
  height: '80%',
  display: 'flex',
  alignItems: 'center',
  transitionDuration: '0.3s',
  cursor: 'help'
};

class ChatBox extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      selectedValue: ''
    };

    const initialLastValues = {
      lastWidth: '200px',
      lastX: 0
    };
    const cachedLastValues = JSON.parse(localStorage.getItem('chatBoxLastValues'));
    this.lastValues = (cachedLastValues && initialLastValues !== cachedLastValues)
      ? cachedLastValues
      : initialLastValues;

    this.canChangeWidth = false;
    this.helperRef = React.createRef();
  };

  componentDidMount() {
    if (this.props.showChat) {
      this.showChat();
    } 
    window.addEventListener('resize', this.updateChatAndVideoSize);
    document.body.addEventListener('mousemove', this.changeWidth);
    document.body.addEventListener('mouseup', this.onLeave);
    document.body.addEventListener('mouseleave', this.onLeave);
    document.body.addEventListener('touchmove', this.changeWidth);
    document.body.addEventListener('touchend', this.onLeave);
  };

  shouldComponentUpdate(nextProps) {
    if (!this.props.showChat && nextProps.showChat) {
      this.showChat();
    } else if (this.props.showChat && !nextProps.showChat) {
      this.hideChat();
    }
    return true;
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChatAndVideoSize);
    document.body.removeEventListener('mousemove', this.changeWidth);
    document.body.removeEventListener('mouseup', this.onLeave);
    document.body.removeEventListener('mouseleave', this.onLeave);
    document.body.removeEventListener('touchmove', this.changeWidth);
    document.body.removeEventListener('touchend', this.onLeave);
  };

  onDown = e => {
    if (!this.canChangeWidth) {
      iframeEventsDisable();
      const x = getCoordinate(e, 'X');
      this.canChangeWidth = true;
      this.lastValues = { ...this.lastValues, lastX: x };
    }
  };

  onLeave = () => {
    if (this.canChangeWidth) {
      iframeEventsEnable();
      this.canChangeWidth = false;
    }
  };

  setSelectedChat = (e) => {
    const selectedValue = e.target.value;
    this.setState({ selectedValue, isLoading: true });
  };

  showChat = () => {
    const { lastWidth } = this.lastValues;
    const chatElement = document.getElementById('chatBox');
    const videoAreaElement = document.getElementById('videoArea');
    const chatHelpElement = document.getElementById('chatHelp');
    const videoWidth = getWindowWidth() - parseInt(lastWidth, 10);
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.display = 'initial';
    videoAreaElement.style.transitionDuration = '0.5s';
    setTimeout(() => {
      chatElement.style.width = lastWidth;
      chatHelpElement.style.opacity = 1;
    }); // wait for transitionDuration property
    videoAreaElement.style.width = `${videoWidth}px`;
    setTimeout(() => {
      chatElement.style.transitionDuration = '0s';
      videoAreaElement.style.transitionDuration = '0s';
    }, 500);  // 0.5s opacity transition
  };

  hideChat = () => {
    const chatElement = document.getElementById('chatBox');
    const videoAreaElement = document.getElementById('videoArea');
    const chatHelpElement = document.getElementById('chatHelp');
    this.lastValues = { ...this.lastValues, lastWidth: chatElement.style.width };
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.width = `0px`;
    videoAreaElement.style.transitionDuration = '0.5s';
    videoAreaElement.style.width = `100%`;
    chatHelpElement.style.opacity = 0;
    setTimeout(() => {
      chatElement.style.display = 'none';
      videoAreaElement.style.transitionDuration = '0s';
      this.setState({ isLoading: true });
    }, 500);  // 0.5s opacity transition
  };

  changeWidth = e => {
    if (this.canChangeWidth) {
      const x = getCoordinate(e, 'X');
      const mouseMoveX = this.lastValues.lastX - x;
      const chatElement = document.getElementById('chatBox');
      const width = parseInt(chatElement.style.width, 10);
      const newWidth = Math.round(width + mouseMoveX);
      const windowWidth = getWindowWidth();
      if (newWidth > 200 && newWidth < windowWidth * 0.5) {
        this.lastValues = { ...this.lastValues, lastWidth: `${width}px`, lastX: x };
        chatElement.style.width = `${newWidth}px`;
        document.getElementById('videoArea').style.width = `${windowWidth - newWidth}px`;
        localStorage.setItem('chatBoxLastValues', JSON.stringify(this.lastValues));
      }
    }
  };

  updateChatAndVideoSize = () => {
    if (this.props.showChat) {
      const windowWidth = getWindowWidth();
      const chatElement = document.getElementById('chatBox');
      const width = parseInt(chatElement.style.width, 10);
      let newVideoWidth = windowWidth - width;
      if (width > newVideoWidth) {
        newVideoWidth = Math.ceil(windowWidth / 2);
        chatElement.style.width = `${Math.floor(windowWidth / 2)}px`;
      }
      document.getElementById('videoArea').style.width = `${newVideoWidth}px`;
    }
  };

  render() {
    const { showChat, darkMode } = this.props;
    const { isLoading, selectedValue } = this.state;
    const selectedChannelName = 
      selectedValue && `${selectedValue.replace(',', '(')})`;
    const link = window.location.hash;
    const chats = getStreamNames();
    // Platforms:
    const youtube = 'yt';
    const mixer = 'm';
    const smashcast = 'sc';

    if (
      (selectedValue === "" || !link.includes(selectedChannelName)) &&
      chats[0]
    ) {
      // Chat is avaiable but is not selected
      const { channelName, platform } = chats[0];
      this.setState({ 
        isLoading: true, 
        selectedValue: `${channelName},${platform}` 
      });
    } else if (selectedValue !== '' && !/\(yt\)|\(t\)|\(sc\)|\(m\)/.test(link)) {
      // Chat is selected but there are no chats avaiable...
      this.setState({ isLoading: true, selectedValue: '' });
    }

    const options = chats.map(chat => {
      const { channelName, platform } = chat;
      const name = channelName.charAt(0).toUpperCase() + channelName.slice(1);
      let optionText = `${name} - Twitch`;
      if (platform === youtube) {
        optionText = `${name} - Youtube`;
      } else if (platform === mixer) {
        optionText = `${name} - Mixer`;
      } else if (platform === smashcast) {
        optionText = `${name} - Smashcast`;
      }
      return (
        <option key={optionText} value={`${channelName},${platform}`}>
          {optionText}
        </option>
      );
    });

    return (
      <ChatBoxWrapper id="chatBox">
        <ChatChangeWidthWrapper 
          onMouseDown={this.onDown} 
          onTouchStart={this.onDown}
        >
          <ChatChangeWidthLine />
        </ChatChangeWidthWrapper>
        {chats[0] && (
          <ChatTopBarWrapper darkMode={darkMode}>
            <ChatSelectWrapper
              darkMode={darkMode}
              value={selectedValue}
              onChange={this.setSelectedChat}
            >
              {options}
            </ChatSelectWrapper>
            <HelpWrapper id="chatHelp" style={HelpWrapperStyle}>
              <DividerWrapper>Twitch</DividerWrapper>
              <p>full support</p>
              <DividerWrapper>Youtube</DividerWrapper>
              <p>
                dark mode can be activated only on YouTube website itself<br/>
                <i>(hint: click your profile picture in order to find it)</i>
              </p>
              <DividerWrapper>Mixer</DividerWrapper>
              <p>dark mode not supported</p>
              <DividerWrapper>Smashcast</DividerWrapper>
              <p>dark mode not supported</p>
            </HelpWrapper>
          </ChatTopBarWrapper>
        )}
        {isLoading && showChat && (
          <Loading />
        )}
        {showChat && (
          <Chat
            selectedChannelName={selectedValue}
            isLoading={bool => this.setState({ isLoading: bool })}
          />
        )}
      </ChatBoxWrapper>
    );
  };
};

ChatBox.propTypes = {
  showChat: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool.isRequired
};

function mapStateToProps({ showChat, darkMode }) {
  return { showChat, darkMode };
};

export default connect(mapStateToProps)(ChatBox);
