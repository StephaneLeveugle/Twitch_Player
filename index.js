$(function(){

  // initializes foundation components
  $(document).foundation();

  // set player to 80% width 
  let playerOptions = {
    width: $(".streamColumn").width() * 0.8
  };

  let initialViewport = getViewport();

  // small - medium screens
  if(initialViewport.width < 1024) {
    $(".accordion").css("min-height", 0);
    // player height to 80%
    playerOptions.height = $(".streamColumn").height() * 0.8;
  } 
  // large screens
  else {
    $(".accordion").css("min-height", initialViewport.height);
    // player height to 50%
    playerOptions.height = $(".streamColumn").height() * 0.5;
  }


  let player = new Twitch.Player("playerContainer", playerOptions);
  // pause it to prevent it from buffering endlessly
  player.pause();
  
  let channels = ["ESL_SC2", "ESL_CSGO", "ZeratoR", "Trick2g", "ESL_Overwatch", "OgamingSC2", "cretetion", "FreeCodeCamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
  

  // iterate through the channels array
  channels.forEach(function(channel, index) {
    $.ajax({
    
      url: "https://api.twitch.tv/kraken/streams/" + channel,
      method: "GET",
      dataType: "json",
      headers: {
        "Client-ID" : "dzcx6bswtv8hnlx6otboezlo19x1m6m"
      },
      success: function(response) {

        // if the stream exists and is online
        if(response && response.stream && response.stream.channel) {

          let html = '<li class="accordion-item" data-accordion-item>' +
                        '<a href="#" class="accordion-title">' +
                          '<img class="logo" src="' + response.stream.channel.logo + '" alt="' + channel + ' logo"><span>' + channel +
                        '</span></a>' +
                        '<div class="accordion-content" data-tab-content>' +
                          '<a class="block text-center" href="https://www.twitch.tv/' + channel + '" target="_blank">' +
                            '<span data-tooltip aria-haspopup="true" class="has-tip" data-disable-hover="false" tabindex="1" title="Click here to be redirected to the channel of ' + channel + '">' +
                              response.stream.channel.status +
                            '</span>' +
                          '</a>';

          // if there is a game listed add it
          if(response.stream.game) {
            html += '<a class="block text-center" href="https://www.twitch.tv/directory/game/' + response.stream.game + '" target="_blank">' + "Game : " + 
                      '<span data-tooltip aria-haspopup="true" class="has-tip" data-disable-hover="false" tabindex="1" title="Click here to see other people streaming ' + response.stream.game + '">' +
                        response.stream.game +
                      '</span>' +
                    '</a>';
          }

          // add viewers count
          html += '<p class="text-center">' + response.stream.viewers + ' people currently watching!</p>';

          // add watch button
          html += '<button class="block button watchBtn expanded" data-channel="' + channel + '">Watch</button>'

          // close 
          html += '</div></li>';

          $("#all > .accordion").append(html);
          $("#online > .accordion").append(html);
        }
        // channel doesn't exist
        else if (response.error) {

          let html = '<li class="accordion-item" data-accordion-item><a href="#" class="accordion-title">' 
            + response.message 
            + '</a><div class="accordion-content" data-tab-content>' + response.error + '</div></li>';
          $("#all > .accordion").append(html);
          $("#offline > .accordion").append(html);
        } 
        // channel offline
        else {

          let html = '<li class="accordion-item" data-accordion-item><a href="#" class="accordion-title">'
            + '<img class="logo" src="./resources/svgs/fi-torso.svg" alt="Default Logo for offline channels"><span>' + channel + '</span></a>' 
            +  '<div class="accordion-content" data-tab-content>'
            +     '<a href="https://www.twitch.tv/' + channel + '" target="_blank">' + channel + ' is offline</a>'
            +   '</div></li>';

          $("#all > .accordion").append(html);
          $("#offline > .accordion").append(html);
        }
        

        // re initialize the sidebar
        Foundation.reInit("accordion");

      }, 
      error: function(err) {
        let html = '<li class="accordion-item" data-accordion-item><a href="#" class="accordion-title">' 
          + err.responseJSON.message 
          + '</a><div class="accordion-content" data-tab-content>' + err.responseJSON.error + '</div></li>';
        $("#all > .accordion").append(html);
        $("#offline > .accordion").append(html);

        Foundation.reInit("accordion");
      }
      
    }); 

    

  });



  // listening on document 
  // standard syntax doesn't work on dynamically added elements
  $(document).on("click", ".watchBtn", function(e) {

    e.preventDefault();

    // get the channel the user wants to watch
    let channel = $(this).attr("data-channel");

    // make sure the user isn't already watching it
    if(channel !== player.getChannel()) {

      // change channel
      player.setChannel(channel);
      player.play();
      // change text above player
      $("#streamInfo").text("Currently watching " + channel);

      // smooth scroll to twitch player if mobile/tablet
      if(getViewport().width < 1024) {
        $('html, body').animate({
          scrollTop: $("#playerContainer").offset().top
        }, 800);
      }
    }


  });

   
  // window resize event 
  // we need to manually resize the twitch player 
  $(window).on("resize", function(e){

    let viewport = getViewport();

    // small - medium screens
    if(viewport.width < 1024) {
      // remove 100% height of accordion
      $(".accordion").css("min-height", 0);
      // ajust twitch player's iframe height
      $("#playerContainer > iframe").attr("height", $(".streamColumn").height() * 0.8);
    } 
    // large screens
    else {
      $(".accordion").css("min-height", viewport.height);
      // ajust twitch player's iframe height
      $("#playerContainer > iframe").attr("height", $(".streamColumn").height() * 0.5);
    }

    // ajust twitch player's iframe width
    $("#playerContainer > iframe").attr("width", $(".streamColumn").width() * 0.8);
    

  });

  
});


// get actual viewport width/height
// is consistent with css media queries
function getViewport() {
    var container = window, property = "inner";
    if (!("innerWidth" in window )) {
       property = "client";
       container = document.documentElement || document.body;
    }
    return { width : container[property + "Width"], height : container[property + "Height"]};
}