import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Triangulr from 'triangulr';
import { BackgroundWrapper } from './styled/Background';

class Background extends React.Component {
  componentDidMount() {
    this.generateSVGBackground(this.props.darkMode);
  };
  
  shouldComponentUpdate(nextProps) {
    this.changeSVGBackground(nextProps.darkMode);   
    return true;
  };

  changeSVGBackground = async (darkMode) => {
    this.removeSVGBackground();
    this.generateSVGBackground(darkMode);
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

  generateSVGBackground = (darkMode) => {
    const colorGenFunction = darkMode 
      ? this.darkColorGenerator 
      : this.lightColorGenerator;
    const mySVG = new Triangulr (2000, 2000, 160, 80, colorGenFunction);
    mySVG.id = 'backgroundSVG';
    mySVG.style.transitionDuration = '0.2s';
    mySVG.style.opacity = 0;
    setTimeout(() => {
      document.getElementById('background').appendChild(mySVG);
    }, 200)
    setTimeout(() => {
      document.getElementById('backgroundSVG').style.opacity = 1;
    }, 250);
  };

  removeSVGBackground = () => {
    const { darkMode } = this.props;
    const backgroundColor = !darkMode 
      ? '#232323' 
      : '#cccccc';
    document.getElementById('background').style.background = backgroundColor;
    document.getElementById('backgroundSVG').style.opacity = 0;
    setTimeout(() => {
      const elementToRemove = document.getElementById('backgroundSVG');
      document.getElementById('background').removeChild(elementToRemove);
    }, 200);
  };

  render() {  
    return (
      <BackgroundWrapper id="background" />
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
