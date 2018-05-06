import React from 'react';
import styled from 'styled-components';
/* Inspired by Daniel Hearn - https://codepen.io/danhearn/pen/MvqgdM */

const LoadingSpinner = styled.span`
  position: absolute;
  z-index: 150;
  width: 100%;
  height: 100%;
  background-color: #000000;
  transition-duration: 0.5s;

  #animationArea {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    animation: loaderAnim 1.2s infinite ease-in-out;
    color: #ffffff;

    #largeBox {
      height: 40px;
      width: 40px;
      background-color: #ffffff;
      position: fixed;
    }
    #smallBox {
      height: 40px;
      width: 40px;
      background-color: #000000;
      position: fixed;
      z-index: 1;
      animation: smallBoxAnim 1.2s alternate infinite ease-in-out;
    }
  }

  @keyframes smallBoxAnim {
    0% {
      transform: scale(0.3);
    }
    100% {
      transform: scale(0.85);
    }
  }

  @keyframes loaderAnim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
`;

const Loading = () => (
  <LoadingSpinner>
    <div id="animationArea">
      <span id="largeBox" />
      <span id="largeBox" style={{ transform: 'rotate(45deg)' }} />
      <span id="smallBox" />
    </div>
  </LoadingSpinner>
);

export default Loading;
