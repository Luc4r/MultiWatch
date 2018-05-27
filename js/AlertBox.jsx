import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Alert from './Alert';
import { AlertBoxWrapper } from './styled/AlertBox';

const AlertBox = props => {
  const alerts = props.alertMessages.split(';').reduce((filtered, alert, i) => {
    if (alert) filtered.push(<Alert key={alert} alertIndex={i} alertMessage={alert} />);
    return filtered;
  }, []);

  return <AlertBoxWrapper>{alerts}</AlertBoxWrapper>;
};

AlertBox.propTypes = {
  alertMessages: PropTypes.string.isRequired
};

function mapStateToProps({ alertMessages }) {
  return { alertMessages };
}

export default connect(mapStateToProps)(AlertBox);
