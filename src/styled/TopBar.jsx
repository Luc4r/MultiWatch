import styled from 'styled-components';

const TopBarWrapper = styled.header`
  position: relative;
  top: 0px;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition-duration: 0.8s;
  background-color: #517edb;
  border-bottom: 2px solid #2350a9;
  box-sizing: border-box;
  z-index: 100;
`;

const LogoAndOptionsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Logo = styled.div`
  margin-top: 10px;
  width: 120px;
  height: 60px;
  transition-duration: 0.2s;
  background-color: #517edb;
  border: 2px solid #2350a9;
  z-index: 10;

  &:hover {
    background-color: #7199ed;
    cursor: pointer;
  }

  img {
    display: block;
    margin: 0 auto;
    padding: 5px 0;
    height: 50px;
    width: 100px;
  }
`;

const Stripe = styled.div`
  position: relative;
  height: 50px;
  width: 45px;
  padding: 5px;
  border-right: 1px solid #2350a9;
  box-sizing: border-box;
`;

const OptionsButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: none;
  color: inherit;
  border: none;
  cursor: pointer;
  outline: inherit;
  transition-duration: 0.2s;

  svg {
    stroke: #FFFFFF;
  }

  &:hover {
    background-color: #7199ed;
    cursor: pointer;
  }
`;

const SearchInputWrapper = styled.div`
  white-space: nowrap;
  margin-right: 50px;

  select {
    margin-right: 8px;
    padding: 3px 5px;
    height: 26px;
    box-sizing: border-box;
    background-color: ${props => props.darkMode ? '#444444' : '#EEEEEE'};
    border: 1px solid #444444;
    outline: none;
    color: ${props => props.darkMode ? '#FFFFFF' : '#232323'};
    transition-duration: 0.3s;
  }

  select > option:nth-child(2n) {
    background-color: ${props => props.darkMode ? "#555555" : "#EEEEEE"};
  }

  input {
    padding: 3px 5px;
    height: 26px;
    width: 180px;
    outline: none;
    box-sizing: border-box;
    color: ${props => props.darkMode ? '#FFFFFF' : '#000000'};
    background-color: ${props => props.darkMode ? '#444444' : '#EEEEEE'};
    border: 1px solid #444444;
    border-right: 0;
    transition-duration: 0.3s;
  }
`;

const SearchIconButton = styled.button`
  position: absolute;
  height: 26px;
  width: 26px;
  padding: 0px 2px;
  box-sizing: border-box;
  background-color: ${props => props.darkMode ? '#444444' : '#EEEEEE'};
  border: 1px solid #444444 !important;
  border-left: 1px dashed #444444 !important;
  transition-duration: 0.3s;

  svg {
    height: 80%;
    stroke: ${props => props.darkMode ? '#FFFFFF' : '#000000'};
    transition-duration: 0.3s;
  }
`;

export {
  TopBarWrapper,
  LogoAndOptionsWrapper,
  Logo,
  Stripe,
  OptionsButton,
  SearchInputWrapper,
  SearchIconButton
};
