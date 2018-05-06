import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Alert from './Alert';
import AlertBoxWrapper from './styled/AlertBoxWrapper';

const AlertBox = props => {
  const alerts = [];
  const dividedAlerts = props.alertMessages.split(';');
  for (let i = 1; i < dividedAlerts.length; i += 1) {
    if (dividedAlerts[i] !== '') {
      alerts.push(<Alert key={dividedAlerts[i]} alertIndex={i} alertMessage={dividedAlerts[i]} />);
    }
  }

  return <AlertBoxWrapper>{alerts}</AlertBoxWrapper>;
};

AlertBox.propTypes = {
  alertMessages: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    alertMessages: state.alertMessages
  };
}

export default connect(mapStateToProps)(AlertBox);
