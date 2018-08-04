import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Chat from './Chat';
import { 
  ChatBoxWrapper,
  ChatSelectWrapper,
  ChatChangeWidthWrapper,
  ChatChangeWidthLine
} from './styled/ChatBox';
import Loading from './Loading';
import { getWindowWidth } from './universalFunctions/windowProperties';
import getCoordinate from './universalFunctions/getCoordinate';
import { iframeEventsDisable, iframeEventsEnable } from './universalFunctions/iframeEvents';
import getStreamNames from './universalFunctions/getStreamNames';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedValue: ''
    };

    let initialLastValues = {
      lastWidth: '200px',
      lastX: 0
    };
    const cachedLastValues = JSON.parse(localStorage.getItem('chatBoxLastValues'));
    if (initialLastValues !== cachedLastValues && cachedLastValues) {
      initialLastValues = cachedLastValues;
    }
    this.lastValues = initialLastValues;

    this.changeIt = false;
  };

  componentDidMount() {
    if (this.props.showChat) this.showChat();
    window.addEventListener('resize', this.updateChatAndVideoSize);
    document.body.addEventListener('mousemove', this.changeWidth);
    document.body.addEventListener('mouseup', this.onLeave);
    document.body.addEventListener('mouseleave', this.onLeave);
    document.body.addEventListener('touchmove', this.changeWidth);
    document.body.addEventListener('touchend', this.onLeave);
  };

  shouldComponentUpdate(nextProps) {
    const { showChat } = this.props;
    if (nextProps.showChat && !showChat) this.showChat();
    else if (!nextProps.showChat && showChat) this.hideChat();
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
    if (!this.changeIt) {
      iframeEventsDisable();
      const x = getCoordinate(e, 'X');
      this.changeIt = true;
      this.lastValues = { lastX: x };
    }
  };

  onLeave = () => {
    if (this.changeIt) {
      iframeEventsEnable();
      this.changeIt = false;
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
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.display = 'initial';
    setTimeout(() => {
      chatElement.style.width = lastWidth;
    });
    const videoWidth = getWindowWidth() - parseInt(lastWidth, 10);
    videoAreaElement.style.width = `${videoWidth}px`;
    setTimeout(() => {
      chatElement.style.transitionDuration = '0s';
      videoAreaElement.style.transitionDuration = `0s`;
    }, 500);
  };

  hideChat = () => {
    const chatElement = document.getElementById('chatBox');
    const videoAreaElement = document.getElementById('videoArea');
    this.lastValues = { lastWidth: chatElement.style.width };
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.width = `0px`;
    videoAreaElement.style.transitionDuration = `0.5s`;
    videoAreaElement.style.width = `100%`;
    setTimeout(() => {
      chatElement.style.display = 'none';
      this.setState({ isLoading: true });
    }, 500);
  };

  changeWidth = e => {
    if (this.changeIt) {
      const x = getCoordinate(e, 'X');
      const mouseMoveX = this.lastValues.lastX - x;
      const chatElement = document.getElementById('chatBox');
      const width = parseInt(chatElement.style.width, 10);
      const newWidth = Math.round(width + mouseMoveX);
      const windowWidth = getWindowWidth();
      if (newWidth > 200 && newWidth < windowWidth * 0.5) {
        this.lastValues = { lastWidth: `${width}px`, lastX: x };
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
      if (windowWidth <= 700 && chatElement.style.width !== '0px') this.hideChat();
      else if (windowWidth > 700 && chatElement.style.width === '0px') this.showChat();
    }
  };

  render() {
    const { isLoading, selectedValue } = this.state;
    const { showChat } = this.props;
    // Platforms:
    const smashcast = 'sc';
    const mixer = 'm';
    const youtube = 'yt';

    let channelName = '';
    if (selectedValue !== '') {
      channelName = `${selectedValue.replace(',', '(')})`;
    }

    const link = window.location.hash;
    const chats = getStreamNames()
      .filter(stream => stream[1] !== youtube)
      .map(stream => stream);

    if ((selectedValue === '' || !link.includes(channelName)) && chats[0]) {
      // Chat is avaiable but is not selected
      this.setState({ isLoading: true, selectedValue: chats[0].toString() });
    } else if (selectedValue !== '' && !/\(t\)|\(sc\)|\(m\)/.test(link)) {
      // Chat is selected but there are no chats avaiable...
      this.setState({ isLoading: true, selectedValue: '' });
    }

    const options = chats.map(chat => {
      const name = chat[0].charAt(0).toUpperCase() + chat[0].slice(1);
      let optionText = `${name} - Twitch`;
      if (chat[1] === smashcast) optionText = `${name} - Smashcast`;
      else if (chat[1] === mixer) optionText = `${name} - Mixer`;
      return (
        <option key={optionText} value={chat}>
          {optionText}
        </option>
      );
    });

    return (
      <ChatBoxWrapper id="chatBox">
        {chats[0] && (
          <ChatSelectWrapper
            value={selectedValue}
            onChange={this.setSelectedChat}
          >
            {options}
          </ChatSelectWrapper>
        )}
        <ChatChangeWidthWrapper 
          onMouseDown={this.onDown} 
          onTouchStart={this.onDown}
        >
          <ChatChangeWidthLine />
        </ChatChangeWidthWrapper>
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
  showChat: PropTypes.bool.isRequired
};

function mapStateToProps({ showChat }) {
  return { showChat };
};

export default connect(mapStateToProps)(ChatBox);
