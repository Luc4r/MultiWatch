import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  margin: 0 4px 0 auto;
  transition-duration: 0.3s;
  cursor: help;

  & > svg {
    stroke: ${props => props.darkMode ? "#FFFFFF" : "#000000"};
  }

  &:hover > * {
    opacity: 1;
  }
`;

const TooltipContentWrapper = styled.div`
  opacity: 0;
  position: absolute;
  top: 100%;
  right: calc(50% - 4px);
  width: auto;
  min-width: 256px;
  padding: 6px;
  background-color: ${props => props.darkMode ? "#111111" : "#EEEEEE"};
  color: ${props => props.darkMode ? "#FFFFFF" : "#000000"};
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.75);
  z-index: 9999;
  transition-duration: 0.3s;
  pointer-events: none;

  & > p {
    text-indent: 1em;
    padding: 8px 0;
  }

  &::after {
    content: " ";
    position: absolute;
    bottom: 100%;
    right: 0;
    border: 4px solid rgba(0, 0, 0, 0);
    border-bottom: 4px solid ${props => props.darkMode ? "#000000" : "#EEEEEE"};
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