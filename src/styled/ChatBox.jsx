import styled from 'styled-components';

const ChatBoxWrapper = styled.div`
  position: absolute;
  width: 0px;
  right: 0;
  height: 100%;
  box-sizing: border-box;
  background-color: #060f1b;
  display: none;

  iframe {
    margin-top: 50px;
    height: calc(100% - 50px);
  }
`;

const ChatSelectWrapper = styled.select`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin: auto;
  width: 50%;
  height: 30px;
  outline: none;
  color: white;
  text-align: center;
  transition-duration: 1s;
  background-color: #444444;
  border: 1px solid #222222;
`;

const ChatChangeWidthWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 10px;
  left: -5px;
  cursor: e-resize;
  z-index: 1;

  &:hover > div {
    width: 10px;
    left: 0px;
  }
`;

const ChatChangeWidthLine = styled.div`
  position: absolute;
  height: 100%;
  width: 1px;
  left: 4px;
  display: table;
  background-color: #2350a9;
  transition-duration: 0.3s;
`;

const ChatErrorWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #111111;
  opacity: 0.8;
  color: white;

  iframe {
    display: none;
  }

  p {
    padding: 20px;
  }
`;

export { 
  ChatBoxWrapper, 
  ChatSelectWrapper, 
  ChatChangeWidthWrapper, 
  ChatChangeWidthLine, 
  ChatErrorWrapper 
};
