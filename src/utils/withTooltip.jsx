import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TooltipWrapper, TooltipContentWrapper } from '../styled/Tooltip';

const withTooltip = (WrappedComponent, position = 'center') => {
  const HOC = ({ id, style, darkMode, ...props }) => {
    const optionalID = id && { id };
    const optionalStyle = style && { style };
    return (
      <TooltipWrapper {...optionalID} {...optionalStyle} darkMode={darkMode}>
        <WrappedComponent {...props} />
        <TooltipContentWrapper darkMode={darkMode} position={position}>
          {props.children}
        </TooltipContentWrapper>
      </TooltipWrapper>
    );
  };

  HOC.defaultProps = {
    id: '',
    style: {},
    children: []
  };

  HOC.propTypes = {
    id: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])),
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