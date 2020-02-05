/**
 * Get youtube channel data from firebase server
 * @param {string} enteredChannel
 * @returns {{ error:number, errorMessage:string }}
 * @returns {{ channelID:string, channelName:string, customUrl:string }}
 */
const getChannelIDAndName = async (enteredChannel) => {
  const firebaseFunction = "https://us-central1-multiwatch-267321.cloudfunctions.net/getChannelNameAndID";
  const result = await fetch(`${firebaseFunction}?channel=${enteredChannel}`)
    .then(response => response.json())
    .catch(error => console.error(error.message));  // eslint-disable-line

  return result;
};

export default getChannelIDAndName;