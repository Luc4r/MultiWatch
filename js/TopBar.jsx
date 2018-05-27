import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TopBarWrapper, Logo } from './styled/TopBar';
import OptionsMenu from './TopBarOptionsMenu';
import SearchSection from './TopBarSearchSection';
import logo from '../assets/Logo.png';

class TopBar extends React.Component {
  componentDidMount() {
    const topBarElement = document.getElementById('topBar');
    if (this.props.isTopBarHidden) topBarElement.style.top = '-50px';
  }

  changeTopBarVisibility = () => {
    const topBarElement = document.getElementById('topBar');
    if (!this.props.isTopBarHidden) topBarElement.style.top = '-50px';
    else topBarElement.style.top = '0px';
    this.props.toggleTopBar();
  };

  render() {
    return (
      <TopBarWrapper id="topBar">
        <div style={{ position: 'relative' }}>
          <Logo onClick={this.changeTopBarVisibility}>
            <img src={logo} alt="Logo" />
          </Logo>
          <OptionsMenu />
        </div>
        <SearchSection />
      </TopBarWrapper>
    );
  }
}

TopBar.propTypes = {
  isTopBarHidden: PropTypes.bool.isRequired,
  toggleTopBar: PropTypes.func.isRequired
};

function mapStateToProps({ isTopBarHidden }) {
  return { isTopBarHidden };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleTopBar: () => {
      dispatch({ type: 'TOPBAR - TOGGLE' });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
