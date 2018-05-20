function getStreamNames() {
  const streams = [];

  window.location.hash
    .split('#')
    .filter(streamName => streamName)
    .map(streamName => {
      const location = streamName.indexOf('(');
      const stream = streamName.substr(0, location);
      const platform = streamName.substring(location + 1, streamName.length - 1);
      streams.push([stream, platform]);
      return 0; // needed?
    });

  return streams;
}

export default getStreamNames;
