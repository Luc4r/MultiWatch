import React from 'react';
import PropTypes from 'prop-types';

const Chat = props => {
  const { selectedChannelName, isLoading } = props;

  if (selectedChannelName !== '') {
    return (
      <iframe
        title={selectedChannelName}
        src={`https://www.twitch.tv/embed/${selectedChannelName}/chat?darkpopout`}
        frameBorder="0"
        height="100%"
        width="100%"
        onLoad={() => isLoading(false)}
      />
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        lineHeight: '100%',
        textAlign: 'center',
        backgroundColor: '#222222',
        opacity: 0.8,
        color: 'white'
      }}
    >
      No chats available...
    </div>
  );
};

Chat.propTypes = {
  selectedChannelName: PropTypes.string.isRequired,
  isLoading: PropTypes.func.isRequired
};

export default Chat;
