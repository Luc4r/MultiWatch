import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getAdditionalHeight from './utils/getAdditionalHeight';
import { 
  AlertWrapper,
  AlertMessageWrapper,
  AlertNumberWrapper,
  AlertBarWrapper,
  AlertBar
} from './styled/AlertBox';

class Alert extends React.Component {
  constructor() {
    super();
    this.state = {
      top: '-200px'
    };
  };
  
  componentDidMount() {
    setTimeout(() => {
      const newTop = this.getTopMargin();
      this.setState({ top: newTop });
    }); // wait for props update
    setTimeout(() => {
      this.props.removeAlert(this.props.alertMessage);
    }, 5800); // 5s bar animation + 0.8s opacity transition
  };

  getTopMargin() {
    const additionalHeight = getAdditionalHeight(this.props.isTopBarHidden) + 10;
    return this.props.alertIndex * 130 + additionalHeight;
  };

  render() {
    const { top } = this.state;
    const { alertMessage } = this.props;
    const newTop = this.getTopMargin();
    if (top !== newTop && top !== '-200px') {
      this.setState({ top: newTop });
    }

    return (
      <AlertWrapper id={alertMessage} style={{ top }}>
        <AlertMessageWrapper>{alertMessage}</AlertMessageWrapper>
        <AlertNumberWrapper id={`number${alertMessage}`}>1</AlertNumberWrapper>
        <AlertBarWrapper>
          <AlertBar />
        </AlertBarWrapper>
      </AlertWrapper>
    );
  };
};

Alert.propTypes = {
  alertMessage: PropTypes.string.isRequired,
  alertIndex: PropTypes.number.isRequired,
  isTopBarHidden: PropTypes.bool.isRequired,
  removeAlert: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    removeAlert: alert => {
      dispatch({ type: 'ALERT - REMOVE', message: alert });
    }
  };
};

function mapStateToProps({ isTopBarHidden }) {
  return { isTopBarHidden };
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
