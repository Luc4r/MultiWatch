import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TopBarOptionsLayoutSelect from './TopBarOptionsLayoutSelect';
import { 
  OptionsMenuWrapper,
  OptionsMenuOptionWrapper,
  OptionsMenuCheckboxWrapper
} from './styled/TopBarOptionsMenu';

const OptionsMenu = props => {
  const toggleChat = () => props.toggleChat();

  const toggleDarkMode = () => props.toggleMode();

  return (
      <OptionsMenuWrapper id="optionsDropdown">
        <OptionsMenuOptionWrapper>
          <OptionsMenuCheckboxWrapper htmlFor="toggleChat">
            Show chat
            <input
              type="checkbox"
              className="switch"
              id="toggleChat"
              defaultChecked={props.showChat}
              onClick={toggleChat}
            />
          </OptionsMenuCheckboxWrapper>
        </OptionsMenuOptionWrapper>
        <OptionsMenuOptionWrapper>
          <OptionsMenuCheckboxWrapper htmlFor="toggleDarkMode">
            Dark mode
            <input
              type="checkbox"
              className="switch"
              id="toggleDarkMode"
              defaultChecked={props.darkMode}
              onClick={toggleDarkMode}
            />
          </OptionsMenuCheckboxWrapper>
        </OptionsMenuOptionWrapper>
        <OptionsMenuOptionWrapper>
          <TopBarOptionsLayoutSelect />
        </OptionsMenuOptionWrapper>
      </OptionsMenuWrapper>
  );
};

OptionsMenu.propTypes = {
  showChat: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleChat: PropTypes.func.isRequired,
  toggleMode: PropTypes.func.isRequired
};

function mapStateToProps({ showChat, videoLayout, darkMode }) {
  return { showChat, videoLayout, darkMode };
};

function mapDispatchToProps(dispatch) {
  return {
    toggleChat: () => {
      dispatch({ type: 'CHAT - TOGGLE' });
    },
    toggleMode: () => {
      dispatch({ type: 'DARKMODE - TOGGLE' });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu);
