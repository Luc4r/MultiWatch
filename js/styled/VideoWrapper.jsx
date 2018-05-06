import styled from 'styled-components';

const VideoWrapper = styled.div`
  position: absolute;
  float: left;
  background: #000000;
  border: 1px solid #121212;
  box-sizing: border-box;
  transition-duration: 0.7s;

  iframe {
    position: absolute;
    top: -1px;
    left: -1px;
    border: 1px solid #121212;
  }
`;

export default VideoWrapper;
