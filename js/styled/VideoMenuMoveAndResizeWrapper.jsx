import styled from 'styled-components';

const VideoMenuMoveAndResizeWrapper = styled.div`
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

export default VideoMenuMoveAndResizeWrapper;
