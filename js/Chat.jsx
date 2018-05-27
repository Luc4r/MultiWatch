import React from 'react';
import PropTypes from 'prop-types';

import { ChatErrorWrapper } from './styled/ChatBox';

const Chat = props => {
  const { selectedChannelName, isLoading } = props;
  const streamName = selectedChannelName.slice(0, selectedChannelName.indexOf(','));
  const streamPlatform = selectedChannelName.slice(
    selectedChannelName.indexOf(',') + 1,
    selectedChannelName.length
  );

  let link = `https://www.twitch.tv/embed/${streamName}/chat?darkpopout`;
  if (streamPlatform === 'sc') {
    link = `https://www.smashcast.tv/embed/chat/${streamName}?autoconnect=true`;
  } else if (streamPlatform === 'm') {
    link = `https://mixer.com/embed/chat/${streamName}`;
  }

  if (streamName) {
    return (
      <iframe
        title={`${streamName}${streamPlatform}`}
        src={link}
        frameBorder="0"
        height="100%"
        width="100%"
        onLoad={() => isLoading(false)}
      />
    );
  }
  return (
    <ChatErrorWrapper>
      <iframe title="justLoad" onLoad={() => isLoading(false)} />
      <p>
        No chats available... <br />
        <br />
        Still working on youtube comments... D:
      </p>
    </ChatErrorWrapper>
  );
};

Chat.propTypes = {
  selectedChannelName: PropTypes.string.isRequired,
  isLoading: PropTypes.func.isRequired
};

export default Chat;
