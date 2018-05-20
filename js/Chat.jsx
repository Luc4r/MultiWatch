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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#111111',
        opacity: 0.8,
        color: 'white'
      }}
    >
      <iframe title="justLoad" style={{ display: 'none' }} onLoad={() => isLoading(false)} />
      <p style={{ padding: '20px' }}>
        No chats available... <br />
        <br />
        Still working on youtube comments... D:
      </p>
    </div>
  );
};

Chat.propTypes = {
  selectedChannelName: PropTypes.string.isRequired,
  isLoading: PropTypes.func.isRequired
};

export default Chat;
