import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Chat from './Chat';
import ChatBoxWrapper from './styled/ChatBoxWrapper';
import Loading from './Loading';
import { getWindowWidth } from './universalFunctions/windowProperties';
import { getX } from './universalFunctions/getXY';
import { iframeEventsDisable, iframeEventsEnable } from './universalFunctions/iframeEvents';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      isLoading: true,
      lastWidth: '200px',
      selectedValue: '',
      changeIt: false,
      lastX: 0,
      isHidden: false
    };
    this.lastPointerEvents = [];
    const cachedState = JSON.parse(localStorage.getItem('chatBoxState'));
    if (initialState !== cachedState && cachedState !== null) {
      initialState = Object.assign({}, cachedState, { isLoading: true });
    }
    this.state = initialState;
  }
  componentDidMount() {
    if (this.props.showChat === true) {
      this.showChat();
    }
    window.addEventListener('resize', this.updateChatAndVideoSize);
    // DESKTOP:
    this.chatChangeWidth.addEventListener('mousedown', this.onClick);
    document.body.addEventListener('mousemove', this.changeWidth);
    document.body.addEventListener('mouseup', this.clickEnded);
    document.body.addEventListener('mouseleave', this.clickEnded);
    // MOBILE:
    this.chatChangeWidth.addEventListener('touchstart', this.onClick);
    document.body.addEventListener('touchmove', this.changeWidth);
    document.body.addEventListener('touchend', this.clickEnded);
  }
  shouldComponentUpdate(nextProps) {
    const { selectedValue } = this.state;
    if (nextProps.showChat === true && (this.props.showChat === false || selectedValue === '')) {
      this.showChat();
    } else if (nextProps.showChat === false && this.props.showChat === true) {
      this.hideChat();
    }
    return true;
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChatAndVideoSize);
    // DESKTOP:
    this.chatChangeWidth.removeEventListener('mousedown', this.onClick);
    document.body.removeEventListener('mousemove', this.changeWidth);
    document.body.removeEventListener('mouseup', this.clickEnded);
    document.body.removeEventListener('mouseleave', this.clickEnded);
    // MOBILE:
    this.chatChangeWidth.removeEventListener('touchstart', this.onClick);
    document.body.removeEventListener('touchmove', this.changeWidth);
    document.body.removeEventListener('touchend', this.clickEnded);
  }

  onClick = e => {
    if (this.state.changeIt === false) {
      iframeEventsDisable();
      const x = getX(e);
      this.setState({ changeIt: true, lastX: x });
    }
  };

  setSelectedChat = () => {
    const selectedValue = this.selectChat.value;
    this.setState({ selectedValue, isLoading: true });
  };

  clickEnded = () => {
    if (this.state.changeIt === true) {
      iframeEventsEnable();
      this.setState({ changeIt: false });
    }
  };

  showChat = () => {
    const { lastWidth } = this.state;
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
    this.setState({ isHidden: false });
  };
  hideChat = () => {
    const chatElement = document.getElementById('chatBox');
    const videoAreaElement = document.getElementById('videoArea');
    this.setState({
      lastWidth: chatElement.style.width
    });
    chatElement.style.transitionDuration = '0.5s';
    chatElement.style.width = `0px`;
    videoAreaElement.style.transitionDuration = `0.5s`;
    videoAreaElement.style.width = `100%`;
    setTimeout(() => {
      chatElement.style.display = 'none';
      this.setState({
        isLoading: true,
        isHidden: true
      });
    }, 500);
  };

  changeWidth = e => {
    const { changeIt, lastX } = this.state;
    const chatElement = document.getElementById('chatBox');
    const width = parseInt(chatElement.style.width, 10);
    if (changeIt === true) {
      const x = getX(e);
      const mouseMoveX = lastX - x;
      const newWidth = Math.round(width + mouseMoveX);
      const windowWidth = getWindowWidth();
      if (newWidth > 200 && newWidth < windowWidth * 0.5) {
        this.setState({ lastWidth: `${width}px`, lastX: x });
        chatElement.style.width = `${newWidth}px`;
        document.getElementById('videoArea').style.width = `${windowWidth - newWidth}px`;
      }
    }
  };

  updateChatAndVideoSize = () => {
    if (this.props.showChat === true) {
      const windowWidth = getWindowWidth();
      const chatElement = document.getElementById('chatBox');
      const width = parseInt(chatElement.style.width, 10);
      let newVideoWidth = windowWidth - width;
      if (width > newVideoWidth) {
        newVideoWidth = Math.ceil(windowWidth / 2);
        chatElement.style.width = `${Math.floor(windowWidth / 2)}px`;
      }
      document.getElementById('videoArea').style.width = `${newVideoWidth}px`;
      if (windowWidth <= 700 && chatElement.style.width !== '0px') {
        this.hideChat();
      } else if (windowWidth > 700 && chatElement.style.width === '0px') {
        this.showChat();
      }
    }
  };

  render() {
    const { isLoading, selectedValue, isHidden } = this.state;
    const { openedStreams, showChat } = this.props;
    localStorage.setItem('chatBoxState', JSON.stringify(this.state));

    const options = [];
    const link = window.location.hash;
    const streamNames = link.split('#');
    if (selectedValue === '' || link.indexOf(selectedValue) === -1) {
      this.setState({ isLoading: true, selectedValue: streamNames[1] });
    }

    for (let i = 1; i <= openedStreams; i += 1) {
      if (streamNames[i]) {
        options.push(
          <option key={streamNames[i]} value={streamNames[i]}>
            {streamNames[i]}
          </option>
        );
      }
    }

    return (
      <ChatBoxWrapper id="chatBox">
        <select
          ref={select => {
            this.selectChat = select;
          }}
          onChange={this.setSelectedChat}
        >
          {options}
        </select>
        <div
          ref={div => {
            this.chatChangeWidth = div;
          }}
        />
        {isLoading === true && showChat === true && <Loading />}
        {showChat === true &&
          isHidden === false && (
            <Chat
              selectedChannelName={selectedValue}
              isLoading={bool => this.setState({ isLoading: bool })}
            />
          )}
      </ChatBoxWrapper>
    );
  }
}

ChatBox.propTypes = {
  openedStreams: PropTypes.number.isRequired,
  showChat: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    showChat: state.showChat
  };
}

export default connect(mapStateToProps)(ChatBox);
