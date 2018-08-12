import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChatBox from './ChatBox';
import VideoList from './VideoList';
import { ContentAreaWrapper, VideoAreaWrapper } from './styled/StreamArea';

const StreamArea = ({ isTopBarHidden, openedStreams }) => {
  let height = '100%';
  let marginTop = '-50px';
  if (!isTopBarHidden) {
    height = 'calc(100% - 50px)';
    marginTop = '0px';
  }

  return (
    <ContentAreaWrapper style={{ height, marginTop }}>
      <VideoAreaWrapper id="videoArea">
        <VideoList openedStreams={openedStreams} />
      </VideoAreaWrapper>
      {openedStreams > 0 && (
        <ChatBox openedStreams={openedStreams} />
      )}
    </ContentAreaWrapper>
  );
};

StreamArea.propTypes = {
  isTopBarHidden: PropTypes.bool.isRequired,
  openedStreams: PropTypes.number.isRequired
};

function mapStateToProps({ isTopBarHidden, openedStreams }) {
  return { isTopBarHidden, openedStreams };
};

export default connect(mapStateToProps)(StreamArea);
