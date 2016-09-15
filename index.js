$(function(){
  
  // let options = {
  //   width: 854,
  //   height: 480,
  //   channel: "ESL_SC2"
  // };
  
  // let player = new Twitch.Player("lala", options);
  // player.setVolume(0.5);
  // player.addEventListener(Twitch.Player.PAUSE, () => { console.log("player is paused")});
  
   $.ajax({
    
    url: "https://api.twitch.tv/kraken/streams/ESL_SC2",
    method: "GET",
    dataType: "jsonp",
    headers: {
      "Client-ID" : "dzcx6bswtv8hnlx6otboezlo19x1m6m"
    },
    success: function(response) {
      $("#test2").text(JSON.stringify(response));
    }, 
    error: function(err) {
      $("#test2").text(JSON.stringify(err))
    }
    
  }); 
  
});