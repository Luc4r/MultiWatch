const getAdditionalHeight = (isTopBarHidden) => {
  if (isTopBarHidden) {
    return 0;
  } 
  return 50;
};

export default getAdditionalHeight;