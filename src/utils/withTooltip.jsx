import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TooltipWrapper, TooltipContentWrapper } from '../styled/Tooltip';

const withTooltip = (WrappedComponent, position = 'center') => {
  const HOC = ({ id, darkMode, ...props }) => {
    const optionalID = id && { id };
    return (
      <TooltipWrapper {...optionalID} darkMode={darkMode}>
        <WrappedComponent {...props} />
        <TooltipContentWrapper darkMode={darkMode} position={position}>
          {props.children}
        </TooltipContentWrapper>
      </TooltipWrapper>
    );
  };

  HOC.defaultProps = {
    id: '',
    children: []
  };

  HOC.propTypes = {
    id: PropTypes.string,
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

export default withTooltip;