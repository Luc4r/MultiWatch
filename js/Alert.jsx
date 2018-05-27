import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { AlertWrapper } from './styled/AlertBox';

class Alert extends React.Component {
  constructor() {
    super();
    this.state = {
      opacity: 1,
      top: '-200px',
      barWidth: '0px'
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const newTop = this.getTopMargin();
      this.setState({ top: newTop, barWidth: '100%' });
    });
    setTimeout(() => {
      this.setState({ opacity: 0 });
    }, 5000);
    setTimeout(() => {
      this.props.removeAlert(this.props.alertMessage);
    }, 5800);
  }

  getTopMargin() {
    let additionalHeight = 60;
    if (this.props.isTopBarHidden === true) additionalHeight = 10;
    return (this.props.alertIndex - 1) * 130 + additionalHeight;
  }

  render() {
    const { opacity, top, barWidth } = this.state;
    const { alertMessage } = this.props;
    const newTop = this.getTopMargin();
    if (top !== newTop && barWidth === '100%') {
      this.setState({ top: newTop });
    }

    return (
      <AlertWrapper
        id={alertMessage}
        style={{ backgroundColor: 'rgba(84,84,84, 0.85)', opacity, top }}
      >
        <h1>{alertMessage}</h1>
        <span id={`number${alertMessage}`}>1</span>
        <div>
          <div style={{ width: barWidth }} />
        </div>
      </AlertWrapper>
    );
  }
}

Alert.propTypes = {
  alertMessage: PropTypes.string.isRequired,
  alertIndex: PropTypes.number.isRequired,
  removeAlert: PropTypes.func.isRequired,
  isTopBarHidden: PropTypes.bool.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    removeAlert: alert => {
      dispatch({ type: 'ALERT - REMOVE', message: alert });
    }
  };
}

function mapStateToProps({ isTopBarHidden }) {
  return { isTopBarHidden };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
