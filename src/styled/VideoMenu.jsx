import styled from 'styled-components';

const VideoMenuWrapper = styled.div`
  position: relative;
  transition-duration: 0.3s;
  z-index: 150;
`;

const VideoMenuBackground = styled.div`
  background: linear-gradient(rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0));
  width: 100%;
  height: 70px;
`;

const VideoMenuChannelNameWrapper = styled.h3`
  float: left;
  height: 40px;
  text-align: center;
  line-height: 25px;
  color: #ffffff;
  cursor: pointer;
  background: linear-gradient(rgb(81, 126, 219), rgba(0, 0, 0, 0));

  word-wrap: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const VideoMenuButton = styled.div`
  float: right;
  height: 35px;
  width: 40px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition-duration: 0.3s;
  background: linear-gradient(rgb(169, 169, 169), rgba(0, 0, 0, 0));

  &:hover {
    background: linear-gradient(rgb(109, 109, 109), rgba(0, 0, 0, 0));
  }
`;

const VideoMenuMoveResizeWrapper = styled.div`
  .labl {
    float: left;
    text-align: center;
    cursor: pointer;

    input {
      visibility: hidden;
      position: absolute;
    }

    input:checked + div {
      height: 36px;
      background: linear-gradient(rgb(235, 194, 71), rgba(0, 0, 0, 0));

      &:hover {
        background: linear-gradient(rgb(170, 143, 59), rgba(0, 0, 0, 0));
      }
    }
  }
`;

export { 
  VideoMenuWrapper, 
  VideoMenuBackground,
  VideoMenuChannelNameWrapper,
  VideoMenuButton,
  VideoMenuMoveResizeWrapper 
};
