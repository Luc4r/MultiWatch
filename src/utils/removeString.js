const removeString = (mainString, stringToRemove, separator, replaceWith) => {
  const newString = mainString.split(separator).reduce((previous, string) => {
    if (string === stringToRemove) return `${previous}${replaceWith}`;
    return `${previous}${separator}${string}`;
  });
  return newString;
};

export default removeString;
