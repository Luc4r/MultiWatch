import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SearchInputWrapper, SearchIconButton } from './styled/TopBar';
import SearchIcon from './utils/svg-icons/search';

const format = /[`~!@#$%^&*()+=[\]{};'"\\|,<>?]/;

class SearchSection extends React.Component {  
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
    if (enteredString.length <= 1) {
      return 'Channel name must be at least 2 charakters long';
    }
    if (this.props.openedStreams > 7) {
      return 'You cannot open more than 8 streams... sorry!';
    }
    if (link.includes(enteredStringLowerCase)) {
      return link.split('#').reduce((value, stream) => {
        const streamName = stream.slice(0, stream.indexOf('('));
        const streamPlatform = stream.slice(stream.indexOf('(') + 1, stream.length - 1);
        if (streamName === enteredStringLowerCase && streamPlatform === platform) {
          return 'This stream is already opened';
        }
        return value;
      });
    }
    return '';
  };

  addStream = () => {
    // TO DO: same youtube channel - entered ID and NAME.
    let enteredString = document.getElementById('searchChannel').value;
    const platform = document.getElementById('topBarSelectPlatform').value;

    if (enteredString.includes('/')) {
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
    this.props.openStream();
  };

  handleKeyDown = e => {
    const enterCharCode = 13;
    const pressedKeyCode = e.keyCode;
    if (pressedKeyCode === enterCharCode) {
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
        <input 
          id="searchChannel" 
          placeholder="Enter channel name/ID..."
          onKeyDown={this.handleKeyDown}
          onChange={this.onInputChange}
        />
        <SearchIconButton onClick={this.addStream}>
          <SearchIcon />
        </SearchIconButton>
      </SearchInputWrapper>
    );
  };
};

SearchSection.propTypes = {
  openedStreams: PropTypes.number.isRequired,

  openStream: PropTypes.func.isRequired,
  addAlert: PropTypes.func.isRequired
};

function mapStateToProps({ openedStreams }) {
  return { openedStreams };
};

function mapDispatchToProps(dispatch) {
  return {
    openStream: () => {
      dispatch({ type: 'STREAM - OPEN' });
    },
    addAlert: message => {
      dispatch({ type: 'ALERT - ADD', message });
    },
    toggleTopBar: () => {
      dispatch({ type: 'TOPBAR - TOGGLE' });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSection);
