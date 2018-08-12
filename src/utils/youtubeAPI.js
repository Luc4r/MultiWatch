const getChannelIDAndName = async (enteredID) => {
  // get channelID - needed to find the livestream
  const API = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=';
  const APIID = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&id=';
  const KEY = '&key=AIzaSyAckbMFR-zOKefEnGSWGbiESpHl81VNOYc';
  let channelID = "";
  let channelName = "";

  await fetch(API + enteredID + KEY)
    .then(response => response.json())
    .then(async (dataName) => {
      if (dataName.pageInfo.totalResults !== 0) {
        // user entered channel name
        const channelData = dataName.items[0];
        channelID = channelData && channelData.id 
        channelName = channelData.snippet.customUrl && channelData.snippet.customUrl;
      } else {
        await fetch(APIID + enteredID + KEY)
          .then(response => response.json())
          .then(dataID => {
            if (dataID.pageInfo.totalResults !== 0 && dataID.items[0].snippet.customUrl) {
              // user entered channel ID
              channelID = dataID.items[0].id;
              channelName = dataID.items[0].snippet.customUrl;
            }
          });
      }
    });
    
  return { channelID, channelName };
};

export default getChannelIDAndName;