import React from 'react';
import { 
  LoadingSpinner,
  AnimationArea,
  LargeBox,
  SmallBox
} from './styled/Loading';
/* Inspired by Daniel Hearn - https://codepen.io/danhearn/pen/MvqgdM */

const Loading = () =>
  <LoadingSpinner>
    <AnimationArea>
      <LargeBox />
      <LargeBox style={{ transform: 'rotate(45deg)' }} />
      <SmallBox />
    </AnimationArea>
  </LoadingSpinner>

export default Loading;
