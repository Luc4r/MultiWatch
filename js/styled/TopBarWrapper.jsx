import styled from 'styled-components';

const TopBarWrapper = styled.header`
  position: absolute;
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition-duration: 0.8s;
  background-color: #517edb;
  border-bottom: 2px solid #2350a9;
  z-index: 100;

  span {
    white-space: nowrap;
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 1px 1px 3px #333333;
    transition-duration: 0.4s;
  }
`;

const Logo = styled.div`
  margin-top: 30px;
  width: 110px;
  height: 60px;
  padding: 5px;
  transition-duration: 0.8s;
  transform: perspective(10px) rotateX(-3deg);
  background-color: #517edb;
  border: 2px solid #2350a9;
  z-index: 10;

  &:hover {
    background-color: #7199ed;
    cursor: pointer;
  }

  img {
    position: absolute;
    height: 60px;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform: perspective(10px) rotateX(3deg);
  }
`;

const SearchInputWrapper = styled.div`
  transition-duration: 0.4s;
  white-space: nowrap;
  margin-right: 50px;

  select {
    margin-right: 8px;
    padding: 3px 5px;
    height: 26px;
    box-sizing: border-box;
    background-color: #eeeeee;
    border: 1px solid #444444;
    outline: none;
    color: #000000;
  }

  input {
    padding: 3px 5px;
    height: 26px;
    width: 180px;
    outline: none;
    box-sizing: border-box;
    border: 1px solid #444444;
    border-right: 0;
  }

  p {
    position: absolute;
    display: inline;
    height: 26px;
    width: 26px;
    box-sizing: border-box;
    background-color: #ffffff;
    border: 1px solid #444444;
    border-left: none;
  }
`;

const Stripe = styled.div`
  position: absolute;
  top: 29px;
  height: 50px;
  width: 45px;
  padding: 5px;
  transform: skew(-18deg);
  border-right: 1px solid #2350a9;
  box-sizing: border-box;
  transition-duration: 0.8s;

  div {
    padding: 3px;
    transform: skew(18deg);
  }

  &:hover {
    background-color: #7199ed;
    cursor: pointer;
  }

  &:hover #dropDown {
    opacity: 1;
    visibility: visible;
  }
`;

const OptionsMenu = styled.div`
  position: absolute;
  margin-top: 7px;
  margin-left: 7px;
  background-color: #f1f1f1;
  width: 200px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  transition-duration: 0.3s;
  visibility: hidden;
  opacity: 0;

  p {
    color: black;
    padding: 6px;
    text-decoration: none;
    display: block;

    &:hover {
      background-color: #7199ed;
      cursor: pointer;
    }

    label {
      cursor: pointer;
    }
  }

  .switch_box {
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-shadow: none;
    display: block;
  }

  input[type='checkbox'].switch {
    -webkit-appearance: none;
    float: right;
    width: 35px;
    height: 19px;
    background: #ddd;
    position: relative;
    outline: none;
    cursor: pointer;
    transition-duration: 0.5s;
  }

  input[type='checkbox'].switch:checked {
    background-color: #0ebeff;
  }

  input[type='checkbox'].switch:after {
    position: absolute;
    content: '';
    width: 15px;
    height: 15px;
    background-color: #ffffff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    left: 3px;
    top: 2px;
    transition-duration: 0.5s;
  }

  input[type='checkbox'].switch:checked:after {
    left: calc(100% - 17px);
  }
`;

export { TopBarWrapper, Logo, SearchInputWrapper, Stripe, OptionsMenu };
