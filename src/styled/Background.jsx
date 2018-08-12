import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: absolute;
  width: 100%;
  min-width: 700px;
  height: 100%;
  min-height: 400px;
  z-index: 0;

  #backgroundSVG {
    position: absolute; 
    width: 100%; 
    height: 100%; 
    padding: 0; 
    stroke: none; 
    z-index: -5; 
    transition-duration: 0.5s;
  }
`;

export { BackgroundWrapper };
