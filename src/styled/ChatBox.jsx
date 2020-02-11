import styled from 'styled-components';

const ChatBoxWrapper = styled.div`
  position: absolute;
  width: 0px;
  right: 0;
  height: 100%;
  box-sizing: border-box;
  background-color: rgba(44, 44, 44, 0.4);
  display: none;

  iframe {
    height: calc(100% - 50px);
  }
`;

const ChatTopBarWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: " ";
    width: 32px;
    margin-right: auto;
    visibility: hidden;
  }
`;

const ChatSelectWrapper = styled.select`
  width: 50%;
  height: 30px;
  outline: none;
  color: ${props => props.darkMode ? "#FFFFFF" : "#000000"};
  text-align: center;
  transition-duration: 0.3s;
  background-color: ${props => props.darkMode ? "#444444" : "#FFFFFF"};
  border: 1px solid #222222;

  & > option:nth-child(2n) {
    background-color: ${props => props.darkMode ? "#555555" : "#EEEEEE"};
  }
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
  height: calc(100% - 50px);
  margin-top: 50px;
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
  ChatTopBarWrapper,
  ChatSelectWrapper, 
  ChatChangeWidthWrapper, 
  ChatChangeWidthLine, 
  ChatErrorWrapper
};
