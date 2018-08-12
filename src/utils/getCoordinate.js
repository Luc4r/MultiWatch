const getCoordinate = (e, type) =>
  type === 'X' ? e.pageX || e.touches[0].pageX : e.pageY || e.touches[0].pageY;

export default getCoordinate;
