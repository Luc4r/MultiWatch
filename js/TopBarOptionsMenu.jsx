import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { OptionsMenuWrapper, Stripe } from './styled/TopBar';
// TO CHANGE - VIDEOS LAYOUT AS CUSTOM SELECT - extensible menu
const OptionsMenu = props => {
  const toggleChat = () => props.toggleChat();

  const changeVideoLayout = e => props.changeLayout(e.target.value);

  return (
    <Stripe style={{ left: '127px' }} onClick={this.changeOptionsVisibility}>
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
      <OptionsMenuWrapper id="dropDown">
        <p>
          <label htmlFor="toggleChat" className="switchBox">
            Show chat
            <input
              type="checkbox"
              className="switch"
              id="toggleChat"
              defaultChecked={props.showChat}
              onClick={toggleChat}
            />
          </label>
        </p>
        <p>
          Change videos layout<br />
          <select defaultValue={props.videoLayout} onChange={changeVideoLayout}>
            <option value="default">Default (Z-Shape)</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </p>
        <p>More soon™</p>
      </OptionsMenuWrapper>
    </Stripe>
  );
};

OptionsMenu.propTypes = {
  showChat: PropTypes.bool.isRequired,
  videoLayout: PropTypes.string.isRequired,

  toggleChat: PropTypes.func.isRequired,
  changeLayout: PropTypes.func.isRequired
};

function mapStateToProps({ showChat, videoLayout }) {
  return { showChat, videoLayout };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleChat: () => {
      dispatch({ type: 'CHAT - TOGGLE' });
    },
    changeLayout: newLayout => {
      dispatch({ type: 'STREAM - CHANGE LAYOUT', newLayout });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu);
