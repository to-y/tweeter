//character counter for user input in form, prevents additions after limit of 140
//allows backspaces and deletes, notifies when over limit

$(document).ready(function () {
  const MAX_CHAR_COUNT = 140;

  var counter = $('.counter');
  var text = $('textarea[name = text]');

  $(text).on('input', function (event) {
    var charCount = text.val().length;
    var remainingChar = MAX_CHAR_COUNT - charCount;

    if (charCount <= MAX_CHAR_COUNT) {
      counter.text(remainingChar).css('color', 'black');
    }
    if (charCount > MAX_CHAR_COUNT && event.keyCode != 8 && event.keyCode != 46) {
      counter.text('Too long!').css('color', 'red');
      console.log(charCount, 'greater than', MAX_CHAR_COUNT);
      text.val(text.val().substring(0, MAX_CHAR_COUNT));
    }
  })
});