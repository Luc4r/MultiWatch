import React from 'react';

import Video from './Video';
import getStreamNames from './universalFunctions/getStreamNames';

class VideoList extends React.Component {
  componentWillMount() {
    let streamNames = window.location.hash;
    const cachedStreamNames = localStorage.getItem('openedStreams');
    if (cachedStreamNames !== null && cachedStreamNames !== '') {
      streamNames = cachedStreamNames;
    }
    const streamNamesNoDuplicates = Array.from(new Set(streamNames.split('#')));
    window.history.pushState('', '', streamNamesNoDuplicates.join('#'));
  }

  render() {
    const Videos = [];
    const streams = getStreamNames();

    for (let i = 0; i < streams.length; i += 1) {
      Videos.push(
        <Video
          key={`${streams[i][0]}(${streams[i][1]})`}
          channelName={streams[i][0]}
          platform={streams[i][1]}
          zIndex={i + 1}
        />
      );
    }
    return <div>{Videos}</div>;
  }
}

export default VideoList;
