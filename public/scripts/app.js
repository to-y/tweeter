/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//wait for page to load before running functions
$(function() {

  /*
  Create the article for single/multiple tweets and append all info to it
  @params tweet object
  @returns container with tweet object information
  */
  function createTweetElement(tweet) {

    let $container = $("<article>").addClass("tweet");
    let $header = $("<header />")
    let $footer = $("<footer />");
    let $img = $('<img class = "avatar" src="' + tweet.user.avatars.regular + '" />');
    let $name = $('<span class = "name">' + tweet.user.name + '</span>');
    let $link = $('<a class = "link">' + tweet.user.handle + '</a>');
    let $contentContainer = $('<div class = "tweetContent">' + tweet.content.text + '</div>');
    let $icons = $('<img class = "icons">');

    //converting miliseconds to days
    let date = new Date(tweet.created_at);
    let currentTime = new Date();
    let diff = currentTime - date;
    let days = Math.round(diff / 1000 / 60 / 60 / 24);

    let $time = $('<span class = "time">' + days + " days ago" + '</span>');
    let $flagIcon = $('<img class = "icon" src= "icon-flag.png"/>');
    let $likeIcon = $('<img class = "icon" src= "icon-like.png"/>');
    let $retweetIcon = $('<img class = "icon" src= "icon-retweet.png"/>');

    ($header)
      .append($img, $name, $link);

    ($footer)
      .append($time, $flagIcon, $likeIcon, $retweetIcon);

    ($container)
      .append($header, $contentContainer, $footer);

    return $container;
  }

  /*
  Responsible for receiving new tweet made by user and calling createTweetElement function
  @params single tweet
  @returns new tweet to top of webpage container
  */
  function singleTweet(tweet) {
    let $tweetContainer = $('#pastTweets');
      createTweetElement(tweet)
        .prependTo($tweetContainer);
  }

  /*
  Posts user input from form on to /tweets, checks if content is empty, prevents page from loading new page upon form submission.
  clears form after submission.
  @params user input in form
  @returns data into database
  */
  $('form').on('submit', function (event) {
    event.preventDefault();

    let textContent = $(this).find("textarea").val();
    let text = $(this).serialize();
    let url = this.action + '?' + text;

    if (textContent === null || textContent === '' || /^\s+$/.test(textContent)) {
      $("span.counter").text("Nothing to post!").css('color', 'red');
      console.log("FAIL TOO SHORT");
    } else {
      console.log('Submitted, performing ajax call...');
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $(this).serialize(),
        success: singleTweet,
        error: function(err) {
          console.log("ajax error!", err);
        }
      });
    }
    $("form")[0].reset();
  });

  /*
  receives object of many tweets, creates containers for each and adds them to end of page
  @params many tweets
  @returns all past tweets at bottom of container
  */
  function renderTweets(tweets) {
    tweets.forEach (function (tweet) {
      let $tweetContainer = $('#pastTweets');

      createTweetElement(tweet)
        .appendTo($tweetContainer);
    });
  }

  /*
  automatically loads past tweets when page loads
  @returns all tweets in /tweets to container in page
  */
  (function loadTweets () {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: renderTweets
    })
  }) ();

  /*
  toggle animation for form on click of compose button, focuses on form upon click
  */
  $(".compose").click(function (event) {
    $("section.new-tweet").slideToggle("slow");
    $("textarea").focus();
  })


});

