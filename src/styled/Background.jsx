import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: absolute;
  width: 100%;
  min-width: 700px;
  height: 100%;
  min-height: 400px;
  z-index: 0;
  transition-duration: 0.6s;

  #backgroundSVGDark,
  #backgroundSVGWhite {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0;
    stroke: none;
    z-index: -5;
  }

  @keyframes fadeIn {
    0% { 
      opacity: 0; 
    }
    100% { 
      opacity: 1; 
    }
  }

  @keyframes fadeOut {
    0% { 
      opacity: 1; 
    }
    100% { 
      opacity: 0; 
    }
  }
`;

export default BackgroundWrapper;
