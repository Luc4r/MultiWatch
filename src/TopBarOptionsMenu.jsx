import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TopBarOptionsLayoutSelect from './TopBarOptionsLayoutSelect';
import { 
  OptionsMenuWrapper,
  OptionsMenuOptionWrapper,
  OptionsMenuCheckboxWrapper
} from './styled/TopBarOptionsMenu';

class OptionsMenu extends React.Component {
  handleClick = e => {
    const clickedElement = e.target;
    if (clickedElement.id === "toggleChat") {
      this.props.toggleChat();
    } else if (clickedElement.id === "toggleDarkMode") {
      this.props.toggleDarkMode();
    }
    clickedElement.setAttribute("disabled", "disabled");
    setTimeout(() => {
      clickedElement.removeAttribute("disabled");
    }, 800);  // 0.8s delay to prevent spamming
  };

  render() {
    const { showChat, darkMode } = this.props;
    
    return (
      <OptionsMenuWrapper id="optionsDropdown">
        <OptionsMenuOptionWrapper>
          <OptionsMenuCheckboxWrapper htmlFor="toggleChat">
            Show chat
            <input
              type="checkbox"
              className="switch"
              id="toggleChat"
              defaultChecked={showChat}
              onClick={this.handleClick}
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
              defaultChecked={darkMode}
              onClick={this.handleClick}
            />
          </OptionsMenuCheckboxWrapper>
        </OptionsMenuOptionWrapper>
        <OptionsMenuOptionWrapper>
          <TopBarOptionsLayoutSelect />
        </OptionsMenuOptionWrapper>
      </OptionsMenuWrapper>
    );
  };
};

OptionsMenu.propTypes = {
  showChat: PropTypes.bool.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleChat: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired
};

function mapStateToProps({ showChat, darkMode }) {
  return { showChat, darkMode };
};

function mapDispatchToProps(dispatch) {
  return {
    toggleChat: () => {
      dispatch({ type: 'CHAT - TOGGLE' });
    },
    toggleDarkMode: () => {
      dispatch({ type: 'DARKMODE - TOGGLE' });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu);
