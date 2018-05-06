import styled from 'styled-components';

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

  h1 {
    position: absolute;
    width: 90%;
    height: 80%;
    margin-top: 25px;
    margin-left: 4%;
    text-align: center;
    overflow: hidden;
    font-size: 20px;
  }

  span {
    position: absolute;
    right: 1px;
    top: 1px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    overflow: hidden;
    background-color: #883333;
    border-radius: 50%;
    opacity: 0;
    transition-duration: 0.3s;
  }

  div {
    position: absolute;
    width: 100%;
    height: 4px;
    bottom: -0.5px;
    right: 0;
    background-color: #444444;

    div {
      height: 100%;
      transition-duration: 5s;
      background-color: #ebc235;
    }
  }
`;

export default AlertWrapper;
