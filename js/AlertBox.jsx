import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Alert from './Alert';
import { AlertBoxWrapper } from './styled/AlertBox';

const AlertBox = props => {
  const alerts = props.alertMessages
    .split(';')
    .filter(alert => alert)
    .map((alert, i) => <Alert key={alert} alertIndex={i} alertMessage={alert} />);

  return <AlertBoxWrapper>{alerts}</AlertBoxWrapper>;
};

AlertBox.propTypes = {
  alertMessages: PropTypes.string.isRequired
};

function mapStateToProps({ alertMessages }) {
  return { alertMessages };
}

export default connect(mapStateToProps)(AlertBox);
