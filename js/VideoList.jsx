import React from 'react';

import Video from './Video';

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
    const streams = [];
    let streamNames = window.location.hash;
    streamNames = streamNames.split('#');

    streamNames
      .filter(streamName => streamName)
      .map((streamName, i) =>
        streams.push(<Video key={streamName} channelName={streamName} zIndex={i + 1} />)
      );

    return <div>{streams}</div>;
  }
}

export default VideoList;
