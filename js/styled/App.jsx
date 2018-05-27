import styled from 'styled-components';

const AppWrapper = styled.div`
  position: absolute;
  width: 100%;
  min-width: 700px;
  height: 100%;
  min-height: 400px;
`;

const RenderAppWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 10%;
  width: 500px;
  height: 160px;
  text-align: center;
  color: #ffffff;
  background-color: #555555;

  p {
    margin-top: 10px;
    font-size: 25px;
  }

  button {
    margin-top: 15px;
    margin-right: 10px;
    margin-bottom: 5px;
    padding: 4px 8px;
    display: inline-block;
    text-decoration: none;
    color: #ffffff;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    background-color: #555555;
    border: 2px solid #d1a521;
    transition-duration: 0.4s;

    &:hover {
      background-color: #ebc247;
      color: #000000;
    }
  }

  span {
    font-size: 14px;
    margin-top: 20px;

    i {
      padding: 5px;
      color: #ebc247;
    }
  }
`;

export { AppWrapper, RenderAppWrapper };
