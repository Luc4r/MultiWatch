import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TooltipWrapper, TooltipContentWrapper } from '../styled/Tooltip';

const withTooltip = (WrappedComponent) => {
  const HOC = (props) => (
    <TooltipWrapper darkMode={props.darkMode}>
      <WrappedComponent {...props} />
      <TooltipContentWrapper darkMode={props.darkMode}>
        {props.children}
      </TooltipContentWrapper>
    </TooltipWrapper>
  );

  HOC.defaultProps = {
    children: []
  };

  HOC.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),

    darkMode: PropTypes.bool.isRequired
  };

  function mapStateToProps({ darkMode }) {
    return { darkMode };
  };

  return connect(mapStateToProps)(HOC);
};

withTooltip.propTypes = {
  darkMode: PropTypes.bool.isRequired
};

export default withTooltip;