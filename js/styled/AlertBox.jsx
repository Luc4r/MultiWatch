import styled from 'styled-components';

const AlertBoxWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 10px;
  width: 250px;
  height: 100%;
  pointer-events: none;
`;

const AlertWrapper = styled.div`
  position: absolute;
  width: 220px;
  height: 120px;
  color: white;
  z-index: 1000;
  transition-duration: 0.8s;
  box-sizing: border-box;
  border: 1px solid #111111;
  box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.2);
  background-color: rgba(84,84,84, 0.85);
  animation: opacityAnim 6s 1;

  @keyframes opacityAnim {
    0%, 85% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const AlertMessageWrapper = styled.h1`
  position: absolute;
  width: 90%;
  height: 80%;
  margin-top: 25px;
  margin-left: 4%;
  text-align: center;
  overflow: hidden;
  font-size: 20px;
`;

const AlertNumberWrapper = styled.span`
  position: absolute;
  right: 2px;
  top: 2px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  overflow: hidden;
  background-color: #883333;
  border-radius: 50%;
  opacity: 0;
  transition-duration: 0.3s;
`;

const AlertBarWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  bottom: 0px;
  right: 0;
  background-color: #444444;
`;

const AlertBar = styled.div`
  height: 100%;
  background-color: #ebc235;
  animation: widthAnim 5s linear 1;

  @keyframes widthAnim {
    0% {
      width: 0px;
    }
    100% {
      width: 100%;
    }
  }
`;

export { 
  AlertBoxWrapper,
  AlertWrapper,
  AlertMessageWrapper,
  AlertNumberWrapper,
  AlertBarWrapper,
  AlertBar
};
