import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SearchInputWrapper } from './styled/TopBar';

const format = /[`~!@#$%^&*()+=[\]{};'"\\|,<>?]/;

class SearchSection extends React.Component {
  componentDidMount() {
    const searchInputElement = document.getElementById('searchChannel');
    searchInputElement.addEventListener('input', this.onInputChange);
    searchInputElement.addEventListener('keydown', this.specialInputEvents);
    this.addButton.addEventListener('click', this.addStream);
  }
  componentWillUnmount() {
    const searchInputElement = document.getElementById('searchChannel');
    searchInputElement.removeEventListener('input', this.onInputChange);
    searchInputElement.removeEventListener('keydown', this.specialInputEvents);
    this.addButton.removeEventListener('click', this.addStream);
  }
  onInputChange = () => {
    const enteredString = document.getElementById('searchChannel').value;
    if (enteredString.includes(' ')) {
      this.props.addAlert('There are no spaces in channel names');
      document.getElementById('searchChannel').value = enteredString.slice(0, -1);
    } else if (format.test(enteredString)) {
      this.props.addAlert('There are no special characters in channel names');
      document.getElementById('searchChannel').value = enteredString.slice(0, -1);
    }
  };

  errorHandler = (enteredString, platform) => {
    const enteredStringLowerCase = enteredString.toLowerCase();
    const link = window.location.hash.toLowerCase();
    if (enteredString.length <= 1) return 'Channel name must be at least 2 charakters long';
    if (this.props.openedStreams > 7) return 'You cannot open more than 8 streams... sorry!';
    if (link.includes(enteredStringLowerCase))
      return link.split('#').reduce((value, stream) => {
        const streamName = stream.slice(0, stream.indexOf('('));
        const streamPlatform = stream.slice(stream.indexOf('(') + 1, stream.length - 1);
        if (streamName === enteredStringLowerCase && streamPlatform === platform) {
          return 'This stream is already opened';
        }
        return value;
      });
    return '';
  };

  addStream = () => {
    // TO DO: same youtube channel - entered ID and NAME.
    let enteredString = document.getElementById('searchChannel').value;
    const platform = document.getElementById('topBarSelectPlatform').value;
    if (enteredString.includes('.com/') || enteredString.includes('.tv/')) {
      // user entered link instead of just channel name/ID
      const lastSlash = enteredString.lastIndexOf('/') + 1;
      enteredString = enteredString.substring(lastSlash, enteredString.length);
    }
    const errorMessage = this.errorHandler(enteredString, platform);
    if (errorMessage) {
      this.props.addAlert(errorMessage);
      return;
    }
    document.getElementById('searchChannel').value = '';
    const URL = window.location.hash;
    window.history.pushState('', '', `${URL}#${enteredString}(${platform})`);
    this.props.openIt();
  };

  specialInputEvents = e => {
    if (e.keyCode === 13) {
      this.addStream();
    }
  };

  render() {
    return (
      <SearchInputWrapper>
        <select id="topBarSelectPlatform">
          <option value="t">Twitch</option>
          <option value="yt">YouTube - WIP</option>
          <option value="sc">Smashcast</option>
          <option value="m">Mixer</option>
        </select>
        <input id="searchChannel" placeholder="Enter channel name/ID..." />
        <p
          ref={p => {
            this.addButton = p;
          }}
        >
          <svg viewBox="0 0 32 32">
            <circle cx="12" cy="12" r="11" />
            <line x1="20" x2="31" y1="20" y2="31" />
          </svg>
        </p>
      </SearchInputWrapper>
    );
  }
}

SearchSection.propTypes = {
  openedStreams: PropTypes.number.isRequired,

  openIt: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired
};

function mapStateToProps({ openedStreams }) {
  return { openedStreams };
}

function mapDispatchToProps(dispatch) {
  return {
    openIt: () => {
      dispatch({ type: 'STREAM - OPEN' });
    },
    addAlert: message => {
      dispatch({ type: 'ALERT - ADD', message });
    },
    toggleTopBar: () => {
      dispatch({ type: 'TOPBAR - TOGGLE' });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSection);
