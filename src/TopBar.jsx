import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { 
  TopBarWrapper, 
  LogoAndOptionsWrapper, 
  Logo, 
  Stripe,
  OptionsButton 
} from './styled/TopBar';
import OptionsMenu from './TopBarOptionsMenu';
import SearchSection from './TopBarSearchSection';
import logo from '../assets/Logo.png';
import GearIcon from './utils/svg-icons/gear';

class TopBar extends Component {
  componentDidMount() {
    const topBarElement = document.getElementById('topBar');
    if (this.props.isTopBarHidden) topBarElement.style.top = '-50px';
  };

  toggleTopBarVisibility = () => {
    const topBarElement = document.getElementById('topBar');
    if (!this.props.isTopBarHidden) {
      topBarElement.style.top = '-50px';
    } else {
      topBarElement.style.top = '0px';
    }
    this.props.toggleTopBar();
  };

  toggleMenuVisibility = () => {
    const dropElement = document.getElementById('optionsDropdown');
    if (dropElement.style.visibility === 'hidden' || !dropElement.style.visibility) {
      dropElement.style.visibility = 'visible';
      dropElement.style.opacity = '1';
    } else {
      dropElement.style.visibility = 'hidden';
      dropElement.style.opacity = '0';
    }
  };

  render() {
    return (
      <TopBarWrapper id="topBar">
        <LogoAndOptionsWrapper>
          <Logo onClick={this.toggleTopBarVisibility}>
            <img src={logo} alt="Logo" />
          </Logo>
          <Stripe>
            <OptionsButton onClick={this.toggleMenuVisibility}>
              <GearIcon />
            </OptionsButton>
            {!this.props.isTopBarHidden && (
              <OptionsMenu />
            )}
          </Stripe>
        </LogoAndOptionsWrapper>
        <SearchSection />
      </TopBarWrapper>
    );
  };
};

TopBar.propTypes = {
  isTopBarHidden: PropTypes.bool.isRequired,
  toggleTopBar: PropTypes.func.isRequired
};

function mapStateToProps({ isTopBarHidden }) {
  return { isTopBarHidden };
};

function mapDispatchToProps(dispatch) {
  return {
    toggleTopBar: () => {
      dispatch({ type: 'TOPBAR - TOGGLE' });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
