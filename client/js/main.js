$(document).ready(function() {

  var $use_response = $('<a>Feedbacks</a>');
  $use_response.attr('id', 'useresponse');
  $use_response.css('background-color', '#3F484F');
  $use_response.css('border-color', '#E2E2E2');
  $use_response.css('color', '#E2E2E2');
  $use_response.css('cursor', 'pointer');
  $use_response.css('cursor', 'hand');
  $use_response.attr('title', 'Feedback');
  $('#header').append($use_response);
  $use_response.click(function(event) {
    var dialogOptions = {
      bgiframe: true,
      autoOpen: true,
      height: 500,
      width: 800,
      modal: true,
      zIndex: 2000,
      stack: false
    };
    var $dialog = $('<div></div>');
    $('BODY').append($dialog);
    $dialog.append($('<iframe width="650" height="450" />').attr("src", "http://useresponse.insidemilan.it/widget?type=feedback")).dialog(dialogOptions);

  });
  
 
});
