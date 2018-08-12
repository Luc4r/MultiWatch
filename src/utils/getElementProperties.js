const getElementProperties = ({ id, properties, parseToInt }) => {
  const element = document.getElementById(id);
  return properties.reduce((filtered, prop) => {
    const newProp = parseToInt
      ? parseInt(element.style[prop], 10)
      : element.style[prop];
    return { ...filtered, [prop]: newProp };
  }, {});
};

export default getElementProperties;