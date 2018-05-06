import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChatBox from './ChatBox';
import VideoList from './VideoList';

class StreamArea extends React.Component {
  render() {
    const { isTopBarHidden, openedStreams } = this.props;

    let height = '100%';
    let marginTop = '-50px';
    if (isTopBarHidden === false) {
      height = 'calc(100% - 50px)';
      marginTop = '0px';
    }

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height,
          marginTop,
          transitionDuration: '0.8s'
        }}
      >
        <div
          id="videoArea"
          style={{
            position: 'relative',
            float: 'left',
            width: '100%',
            height: '100%',
            transitionDuration: '0.5s'
          }}
        >
          <VideoList streams={openedStreams} />
        </div>
        {openedStreams > 0 && (
          <ChatBox
            openedStreams={openedStreams}
            chatChangedWidth={(newVideoWidth, doTransition) => {
              this.changeVideoWidth(newVideoWidth, doTransition);
            }}
          />
        )}
      </div>
    );
  }
}

StreamArea.propTypes = {
  isTopBarHidden: PropTypes.bool.isRequired,
  openedStreams: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    isTopBarHidden: state.isTopBarHidden,
    openedStreams: state.openedStreams
  };
}

export default connect(mapStateToProps)(StreamArea);
