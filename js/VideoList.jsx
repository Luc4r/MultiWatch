import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Video from './Video';
import getStreamNames from './universalFunctions/getStreamNames';

class VideoList extends React.Component {
  componentWillMount() {
    let streamNames = window.location.hash;
    const cachedStreamNames = localStorage.getItem('openedStreams');
    if (cachedStreamNames) streamNames = cachedStreamNames;
    const streamNamesNoDuplicates = streamNames.split('#').reduce((filtered, stream) => {
      if (!filtered.includes(stream)) filtered.push(stream);
      else this.props.closeStream(); // user entered the same channel in the URL at least twice
      return filtered;
    }, []);
    window.history.pushState('', '', streamNamesNoDuplicates.join('#'));
  }

  render() {
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

    return <div>{videos}</div>;
  }
}

VideoList.propTypes = {
  closeStream: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    closeStream: () => {
      dispatch({ type: 'STREAM - CLOSE' });
    }
  };
}

export default connect(null, mapDispatchToProps)(VideoList);
