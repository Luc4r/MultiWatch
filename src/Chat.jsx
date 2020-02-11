import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ChatErrorWrapper } from './styled/ChatBox';

const Chat = ({ selectedChannelName, isLoading, darkMode }) => {
  const streamName = selectedChannelName.slice(
    0, 
    selectedChannelName.indexOf(',')
  );
  const streamPlatform = selectedChannelName.slice(
    selectedChannelName.indexOf(',') + 1,
    selectedChannelName.length
  );
  // Platforms:
  const youtube = 'yt';
  const mixer = 'm';
  const smashcast = 'sc';
  let link = (darkMode)
    ? `https://www.twitch.tv/embed/${streamName}/chat?darkpopout`
    : `https://www.twitch.tv/embed/${streamName}/chat`;
  if (streamPlatform === youtube) {
    const channelData = JSON.parse(localStorage.getItem(
      `${streamName}(${streamPlatform})State`
    ));
    if (channelData && channelData.livestreamUrl) {
      link = `https://www.youtube.com/live_chat?v=${channelData.livestreamUrl}&embed_domain=${window.location.hostname}`;
      // addAlert(`
      //   Pssst, did you know that YouTube supports dark mode?\n
      //   There is a link how to enable it: https://support.google.com/youtube/answer/7385323
      // `);
    }
  } else if (streamPlatform === mixer) {
    link = `https://mixer.com/embed/chat/${streamName}`;
  } else if (streamPlatform === smashcast) {
    link = `https://www.smashcast.tv/embed/chat/${streamName}?autoconnect=true`;
  }

  return (streamPlatform !== youtube || !link.includes("twitch")) ? (
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
      <iframe title="justLoad" src={link} onLoad={() => isLoading(false)} />
      <p>
        No chat available... 
        <br />
        <br />
        Are you sure you have provided correct channel ID/name? 
      </p>
    </ChatErrorWrapper>
  );
};

Chat.propTypes = {
  selectedChannelName: PropTypes.string.isRequired,
  isLoading: PropTypes.func.isRequired,

  darkMode: PropTypes.bool.isRequired
};

function mapStateToProps({ darkMode }) {
  return { darkMode };
};

export default connect(mapStateToProps)(Chat);
