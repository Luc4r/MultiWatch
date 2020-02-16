import styled from 'styled-components';

const handleLeftTooltipValue = position => {
  switch (position) {
    case 'left':
      return '0';
    case 'center':
      return '50%';
    default:
      return 'auto';
  }
};

const TooltipWrapper = styled.div`
  position: relative;
  height: 100%;

  & > svg {
    stroke: ${props => props.darkMode ? "#FFFFFF" : "#000000"};
    transition-duration: 0.3s;
  }

  &:hover > * {
    opacity: 1;
  }
`;

const TooltipContentWrapper = styled.div`
  opacity: 0;
  position: absolute;
  top: 100%;
  left: ${props => props.position === 'left' ? 'calc(50% - 4px)' : 'auto'};
  right: ${props => props.position === 'right' ? 'calc(50% - 4px)' : 'auto'};
  width: auto;
  max-width: 50vw;
  padding: 6px;

  background-color: ${props => props.darkMode ? "#111111" : "#EEEEEE"};
  color: ${props => props.darkMode ? "#FFFFFF" : "#000000"};
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.75);
  z-index: 9999;
  transition-duration: 0.3s;
  pointer-events: none;

  & > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-indent: 1em;
    padding: 8px 0;
  }

  &::after {
    content: " ";
    position: absolute;
    bottom: 100%;
    left: ${props => handleLeftTooltipValue(props.position)};
    right: ${props => props.position === 'right' ? 0 : 'auto'};
    transform: ${props => props.position === 'center' ? 'translateX(-50%)' : 'none'};
    border: 4px solid rgba(0, 0, 0, 0);
    border-bottom: 4px solid ${props => props.darkMode ? "#111111" : "#EEEEEE"};
  }

`;

const DividerWrapper = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: #2350a9;
  margin: 8px 0px;

  &::before,
  &::after {
    content: "";
    flex-grow: 1;
    background: #2350a9;
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 8px;
  }
`;

export {
  TooltipWrapper,
  TooltipContentWrapper,
  DividerWrapper
};