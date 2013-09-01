$(document).ready(function() {
  var $discovery_button = $('#discovery-button');
  $discovery_button.append($('<img src="images/arrow-left.png" alt="logo" />'));
  
  $discovery_button.click(function(evt){
    
    if( $('#discovery-content').is(':visible') === true){
      $discovery_button.empty();
      $('#discovery-content').hide();
      $discovery_button.append($('<img src="images/arrow-left.png" alt="logo" />'));
      $('#discovery').animate({width:"30px"},400);
    }else{
      $discovery_button.empty();
      $('#discovery-content').show();
      $discovery_button.append($('<img src="images/arrow-right.png" alt="logo" />'));
      $('#discovery').animate({width:"450px"},400);
    }
  });

});

