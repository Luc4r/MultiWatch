import React from 'react';

import Video from './Video';
import getStreamNames from './utils/getStreamNames';

const VideoList = () => {
  const videos = getStreamNames().map((stream, i) => {
    const { channelName, platform } = stream;
    return (
      <Video
        key={`${channelName}(${platform})`}
        channelName={channelName}
        platform={platform}
        zIndex={i + 1}
      />
    );
  });

  return (
    <div>
      {videos}
    </div>
  );
};

export default VideoList;
