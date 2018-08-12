import React from 'react';
import PropTypes from 'prop-types';

import { ChatErrorWrapper } from './styled/ChatBox';

const Chat = ({ selectedChannelName, isLoading }) => {
  const streamName = selectedChannelName.slice(0, selectedChannelName.indexOf(','));
  const streamPlatform = selectedChannelName.slice(
    selectedChannelName.indexOf(',') + 1,
    selectedChannelName.length
  );
  // Platforms:
  const smashcast = 'sc';
  const mixer = 'm';
  let link = `https://www.twitch.tv/embed/${streamName}/chat?darkpopout`;
  if (streamPlatform === smashcast) {
    link = `https://www.smashcast.tv/embed/chat/${streamName}?autoconnect=true`;
  } else if (streamPlatform === mixer) {
    link = `https://mixer.com/embed/chat/${streamName}`;
  }

  return streamName ? (
    <iframe
      title={`${streamName}${streamPlatform}`}
      src={link}
      frameBorder="0"
      height="100%"
      width="100%"
      onLoad={() => isLoading(false)}
    />
  ) : (
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
