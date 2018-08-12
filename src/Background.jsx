import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Triangulr from 'triangulr';

import { BackgroundWrapper } from './styled/Background';

class Background extends React.Component {
  getBackgroundColor = () => {
    const { darkMode } = this.props;
    return darkMode ? '#232323' : '#cccccc';
  };

  lightColorGenerator = (path) => {
    const randomMax = 64;
    const randomMin = 0;
    const ratio = (path.x * path.y) / (path.cols * path.lines);
    let code = Math.floor(
      255 - (ratio * (255 - randomMax)) - ((Math.random() * randomMax) + randomMin)
    );
    code = code.toString(16);
    return `#${code}${code}${code}`;
  };
  
  darkColorGenerator = () => {
    const randomMax = 64;
    const randomMin = 0;
    const ratio = (Math.random() * 0.25) + 0.01;
    const code = Math.floor((ratio * ((Math.random() * randomMax) + randomMin)))
    const finalCode = (code + 48).toString(16);
    return `#${finalCode}${finalCode}${finalCode}`;
  };

  changeSVGBackground = (darkMode) => {
    if (document.getElementById('backgroundSVG')) {
      this.removeSVGBackground();
    }
    this.generateSVGBackground(darkMode);
  };

  generateSVGBackground = (darkMode) => {
    const colorGeneratorFunction = darkMode 
      ? this.darkColorGenerator 
      : this.lightColorGenerator;
    const SVGBackground = new Triangulr (2000, 2000, 222, 111, colorGeneratorFunction);
    SVGBackground.id = 'backgroundSVG';
    SVGBackground.style.transitionDuration = '0.2s';
    SVGBackground.style.opacity = 0;
    setTimeout(() => {
      document.getElementById('background').appendChild(SVGBackground);
    }, 200); // 0.2s opacity transition
    setTimeout(() => {
      document.getElementById('backgroundSVG').style.opacity = 1;
    }, 250); // 0.2s opacity transition + 0.05s render delay
  };

  removeSVGBackground = () => {
    const elementToRemove = document.getElementById('backgroundSVG');
    elementToRemove.style.opacity = 0;
    setTimeout(() => {
      document.getElementById('background').removeChild(elementToRemove);
    }, 200); // 0.2s opacity transition
  };

  render() {  
    const backgroundColor = this.getBackgroundColor();
    this.changeSVGBackground(this.props.darkMode);
    
    return (
      <BackgroundWrapper id="background" style={{ backgroundColor }} />
    );
  };
};

Background.propTypes = {
  darkMode: PropTypes.bool.isRequired
};

function mapStateToProps({ darkMode }) {
  return { darkMode };
};

export default connect(mapStateToProps)(Background);
