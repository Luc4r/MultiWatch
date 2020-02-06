import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Triangulr from 'triangulr';

import BackgroundWrapper from './styled/Background';

class Background extends React.Component {
  componentDidMount() {
    this.changeSVGBackground(this.props.darkMode);
  };

  componentDidUpdate() {
    this.changeSVGBackground(this.props.darkMode);
  };

  getBackgroundColor = () => {
    const { darkMode } = this.props;
    return darkMode ? '#232323' : '#cccccc';
  };

  lightColorGenerator = (path) => {
    const randomMax = 32;
    const ratio = (path.x * path.y) / (path.cols * path.lines);
    let code = Math.floor(
      255 - (ratio * (255 - randomMax)) - ((Math.random() * randomMax))
    );
    code = code.toString(16);
    return `#${code}${code}${code}`;
  };

  darkColorGenerator = () => {
    const randomMax = 32;
    const ratio = (Math.random() * 0.16) + 0.01;
    let code = Math.floor(ratio * (Math.random() * randomMax));
    code = (code + 32).toString(16);
    return `#${code}${code}${code}`;
  };

  changeSVGBackground = (darkMode) => {
    if (document.getElementById('background').childElementCount) {
      this.removeSVGBackground(!darkMode);
    }
    this.generateSVGBackground(darkMode);
  };

  generateSVGBackground = (darkMode) => {
    const colorGenerator = darkMode 
      ? this.darkColorGenerator 
      : this.lightColorGenerator;
    const SVGBackground = new Triangulr (2048, 2048, 222, 111, colorGenerator);
    SVGBackground.id = darkMode ? 'backgroundSVGDark' : 'backgroundSVGWhite';
    SVGBackground.style.animation = 'fadeIn 0.6s';

    document.getElementById('background').appendChild(SVGBackground);
  };

  removeSVGBackground = (darkMode) => {
    const elementID = darkMode ? 'backgroundSVGDark' : 'backgroundSVGWhite';
    const elementToRemove = document.getElementById(elementID);
    elementToRemove.style.animation = 'fadeOut 0.6s';
    elementToRemove.addEventListener("animationend", () => {
      document.getElementById('background').removeChild(elementToRemove);
    });
  };

  render() {  
    const backgroundColor = this.getBackgroundColor();

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
