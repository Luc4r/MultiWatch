import React from 'react';

import Video from './Video';
import getStreamNames from './utils/getStreamNames';

const VideoList = () => {
  const videos = getStreamNames()
    .filter(video => video)
    .map((video, i) => (
      <Video
        key={`${video[0]}(${video[1]})`}
        channelName={video[0]}
        platform={video[1]}
        zIndex={i + 1}
      />
    ));

  return (
    <div>{videos}</div>
  );
};

export default VideoList;
