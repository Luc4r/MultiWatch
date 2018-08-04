function getStreamNames() {
  return window.location.hash.split('#').reduce((filtered, stream) => {
    if (stream) {
      const location = stream.indexOf('(');
      const name = stream.substr(0, location);
      const platform = stream.substring(location + 1, stream.length - 1);
      filtered.push([name, platform]);
    }
    return filtered;
  }, []);
}

export default getStreamNames;
