const getStreamNames = () =>
  window.location.hash
    .split('#')
    .filter(stream => stream)
    .map(stream => {
      const location = stream.indexOf('(');
      const channelName = stream.substr(0, location);
      const platform = stream.substring(location + 1, stream.length - 1);
      return { channelName, platform };
    });

export default getStreamNames;
