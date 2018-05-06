import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  TopBarWrapper,
  Logo,
  SearchInputWrapper,
  Stripe,
  OptionsMenu
} from './styled/TopBarWrapper';
import logo from '../assets/Logo.png';

class TopBar extends React.Component {
  constructor(props) {
    super();
    let initialState = {
      searchTerm: '',
      topBarTop: '0px',
      topBarElementsOpacity: 1,
      topBarElementsVisibility: 'visible'
    };
    if (props.isTopBarHidden === true) {
      initialState = {
        topBarTop: '-50px',
        topBarElementsOpacity: 0,
        topBarElementsVisibility: 'hidden'
      };
    }
    this.state = initialState;
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.props.showChat === true) document.getElementById('toggleChat').checked = true;
    });
  }

  onInputChange = () => {
    const enteredString = document.getElementById('searchChannel').value;
    const format = /[`~!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]/;
    if (enteredString.indexOf(' ') !== -1) {
      this.props.addAlert('There are no spaces in channel names');
      return;
    } else if (format.test(enteredString)) {
      this.props.addAlert('There are no special characters in channel names');
      return;
    }
    this.setState({ searchTerm: enteredString });
  };

  addStream = () => {
    const enteredString = document.getElementById('searchChannel').value;
    const link = window.location.hash;
    if (enteredString.length <= 1) {
      this.props.addAlert('Channel name must be at least 2 charakters long');
      return;
    }
    if (link.indexOf(enteredString) !== -1) {
      const dividedStreamNames = link.split('/');
      for (let i = 1; i < dividedStreamNames.length; i += 1) {
        if (dividedStreamNames[i] === enteredString) {
          this.props.addAlert('This stream is already opened');
          return;
        }
      }
    }
    if (this.props.openedStreams > 7) {
      this.props.addAlert('You cannot open more than 8 streams... sorry!');
      return;
    }
    this.props.openIt(enteredString);
    this.setState({ searchTerm: '' });
    const URL = window.location.hash;
    window.history.pushState('', '', `${URL}#${this.state.searchTerm}`);
  };

  specialInputEvents = e => {
    if (e.keyCode === 13) {
      this.addStream();
    }
  };

  changeTopBarVisibility = () => {
    if (this.props.isTopBarHidden === false) {
      this.props.hideTopBar();
      this.setState({
        topBarTop: '-50px',
        topBarElementsOpacity: 0,
        topBarElementsVisibility: 'hidden'
      });
    } else {
      this.props.showTopBar();
      this.setState({
        topBarTop: '0px',
        topBarElementsOpacity: 1,
        topBarElementsVisibility: 'visible'
      });
    }
  };

  render() {
    const { searchTerm, topBarTop, topBarElementsOpacity, topBarElementsVisibility } = this.state;

    return (
      <TopBarWrapper
        style={{
          position: 'relative',
          top: topBarTop
        }}
      >
        <div style={{ position: 'relative' }}>
          <Logo onClick={this.changeTopBarVisibility}>
            <img src={logo} alt="Logo" />
          </Logo>
          <Stripe
            onClick={this.changeOptionsVisibility}
            style={{
              left: '127px',
              opacity: topBarElementsOpacity,
              visibility: topBarElementsVisibility
            }}
          >
            <div>
              <svg viewBox="0 0 32 32" style={{ height: '26px', padding: '1px' }}>
                <path d="M31,18V14H27.82a11.92,11.92,0,0,0-2-4.95L28,6.81,25.19,4,
                22.95,6.23a11.92,11.92,0,0,0-4.95-2V1H14V4.18a11.92,11.92,0,0,0-4.95,
                2L6.81,4,4,6.81,6.23,9.05a11.92,11.92,0,0,0-2,4.95H1v4H4.18a11.92,
                11.92,0,0,0,2,4.95L4,25.19,6.81,28l2.25-2.25a11.92,11.92,0,0,0,4.95,
                2V31h4V27.82a11.92,11.92,0,0,0,4.95-2L25.19,28,28,
                25.19l-2.25-2.25a11.92,11.92,0,0,0,2-4.95Z" />
                <circle cx="16" cy="16" r="5" />
              </svg>
            </div>
            <OptionsMenu id="dropDown">
              <p>
                <label htmlFor="toggleChat" className="switch_box">
                  Show chat
                  <input
                    type="checkbox"
                    className="switch"
                    id="toggleChat"
                    onClick={() => this.props.toggleChat()}
                  />
                </label>
              </p>
              <p>More soon™</p>
            </OptionsMenu>
          </Stripe>
          {/* <Stripe
            style={{
              left: '172px',
              opacity: topBarElementsOpacity,
              visibility: topBarElementsVisibility
            }}
          >
            <div>
              <svg viewBox="0 0 32 32" style={{height: '26px', padding: '1px'}}>
                <circle cx="16" cy="16" r="15" />
                <path d="M10,12a6,6,0,1,1,6,6v5" />
                <line x1="15" x2="17" y1="26" y2="26" />
              </svg>
            </div>
          </Stripe>
          */}
        </div>
        <SearchInputWrapper
          style={{
            opacity: topBarElementsOpacity,
            visibility: topBarElementsVisibility
          }}
        >
          <select onChange={() => this.setSelectedChat()}>
            <option value="twitch">Twitch</option>
            <option value="youtube" disabled>
              YouTube - WIP
            </option>
            <option value="smashcast" disabled>
              Smashcast - WIP
            </option>
          </select>
          <input
            id="searchChannel"
            placeholder="Enter channel name..."
            value={searchTerm}
            onChange={this.onInputChange}
            onKeyDown={this.specialInputEvents}
          />
          <p onClick={this.addStream} onKeyDown={this.addStream} role="presentation">
            <svg viewBox="0 0 32 32">
              <circle cx="12" cy="12" r="11" />
              <line x1="20" x2="31" y1="20" y2="31" />
            </svg>
          </p>
        </SearchInputWrapper>
      </TopBarWrapper>
    );
  }
}

TopBar.propTypes = {
  isTopBarHidden: PropTypes.bool.isRequired,
  showChat: PropTypes.bool.isRequired,
  openedStreams: PropTypes.number.isRequired,

  openIt: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired,
  showTopBar: PropTypes.func.isRequired,
  hideTopBar: PropTypes.func.isRequired,
  toggleChat: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    openIt: channelName => {
      dispatch({ type: 'STREAM - OPEN', name: channelName });
    },
    addAlert: alert => {
      dispatch({ type: 'ALERT - ADD', message: alert });
    },
    showTopBar: () => {
      dispatch({ type: 'TOPBAR - SHOW' });
    },
    hideTopBar: () => {
      dispatch({ type: 'TOPBAR - HIDE' });
    },
    toggleChat: () => {
      dispatch({ type: 'CHAT - TOGGLE' });
    }
  };
}

function mapStateToProps(state) {
  return {
    isTopBarHidden: state.isTopBarHidden,
    openedStreams: state.openedStreams,
    showChat: state.showChat
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
