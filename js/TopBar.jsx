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
              <svg viewBox="0 0 32 32" style={{ height: '26px', padding: '1px' }}>
                <path d="M31,18V14H27.82a11.92,11.92,0,0,0-2-4.95L28,6.81,25.19,4,
                22.95,6.23a11.92,11.92,0,0,0-4.95-2V1H14V4.18a11.92,11.92,0,0,0-4.95,
                2L6.81,4,4,6.81,6.23,9.05a11.92,11.92,0,0,0-2,4.95H1v4H4.18a11.92,
                11.92,0,0,0,2,4.95L4,25.19,6.81,28l2.25-2.25a11.92,11.92,0,0,0,4.95,
                2V31h4V27.82a11.92,11.92,0,0,0,4.95-2L25.19,28,28,
                25.19l-2.25-2.25a11.92,11.92,0,0,0,2-4.95Z" />
                <circle cx="16" cy="16" r="5" />
              </svg>
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
