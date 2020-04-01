import styled from 'styled-components';

const OptionsMenuWrapper = styled.div`
  position: absolute;
  width: 200px;
  left: 0;
  top: 50px;
  background-color: #d7d7d7;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-left: 1px solid #777777;
  border-right: 1px solid #777777;
  border-bottom: 1px solid #777777;
  transition-duration: 0.3s;
  visibility: hidden;
  opacity: 0;
  z-index: 5;
`;

const OptionsMenuOptionWrapper = styled.div`
  position: relative;
  display: block;
  color: black;
  border-bottom: 1px outset #999999;
  transition-duration: 0.2s;

  &:hover {
    background-color: #bbbbbb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const OptionsMenuCheckboxWrapper = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 6px;
  cursor: pointer;

  select {
    cursor: pointer;
    display: block;
    margin: auto;
    margin-top: 5px;
    padding: 3px 5px;
    height: 26px;
    width: 100%;
    box-sizing: border-box;
    background-color: #eeeeee;
    outline: none;
  }

  .switch {
    appearance: none;
    float: right;
    width: 35px;
    height: 19px;
    background: #999999;
    position: relative;
    outline: none;
    cursor: pointer;
    transition-duration: 0.5s;
  }

  .switch:checked {
    background-color: #517edb;
  }

  .switch:after {
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

  .switch:checked:after {
    left: calc(100% - 17px);
  }
`;

const TopBarOptionsSelectWrapper = styled.p`
  position: relative;
  overflow: hidden;
  min-height: 40px;
  padding: 12px 6px;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const VideosLayoutTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #000000;
  font-weight: initial;
  text-shadow: none;
  font-size: 16px;
`;

const VideosLayoutDropdownWrapper = styled.div`
  opacity: 0;
  padding: 0;
  height: 0px;
  visibility: hidden;
  transition: visibility 200s, opacity 500ms, height 500ms;
  overflow-y: hidden;
`;

const VideosLayoutOption = styled.label`
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  width: 100%;
  height: 30px;
  margin-top: 4px;

  input {
    visibility: hidden;
    position: absolute;
  }

  input:checked + p {
    background-color: #517edb;
    color: #ffffff;

    &:hover {
      background-color: #7199ed;
    }
  }
`;

const VideosLayoutDescription = styled.p`
  background-color: #ffffff;
  height: 30px;
  width: 90%;
  padding: 0;
  color: #000000;
  font-size: initial;
  font-weight: initial;

  text-shadow: none;
  line-height: 30px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  transition-duration: 0.2s;

  &:hover {
    background-color: #dddddd;
  }
`;

const VideosLayoutCurrentWrapper = styled.i`
  position: absolute;
  width: calc(100% - 12px);
  text-align: center;
  font-size: 14px;
  color: #517edb;
  font-weight: bold;
`;

export {
  OptionsMenuWrapper,
  OptionsMenuOptionWrapper,
  OptionsMenuCheckboxWrapper,
  TopBarOptionsSelectWrapper,
  VideosLayoutTitleWrapper,
  VideosLayoutDropdownWrapper,
  VideosLayoutOption,
  VideosLayoutDescription,
  VideosLayoutCurrentWrapper
};