$(document).ready(function() {
  var request = $.ajax({
    type: "GET",
    url: 'getAllFeedRss/10',
    dataType: "jsonp",
    contentType: "application/jsonp; charset=utf-8",
    jsonp: 'callback',
    jsonpCallback: 'parseResponse',
    crossDomain: true
  });

  request.fail(function(jqXHR, textStatus) {
    //$('#client_response_1').append('<pre style="color:red">The Rss Feeds not running. Please run ruby ruby rssFeedScheduler.rb and ruby rssFeedServer.rb</pre>');
  });
  request.done(function(data) {
    var $list = $('<ul></ul>');
    $('#client_response_1').append($list);

    $.each(data, function(index, element) {
      var link = $('<a></a>');
      link.attr('href', element.link);
      link.attr('title', element.description);
      link.append(element.title);
      var pubDate = new Date(Date.parse(element.pubDate));
      var datetime = pubDate.getMonth() + 1 + '/' + pubDate.getDate() + '/' + pubDate.getFullYear() + ' - ' + pubDate.getHours() + ':' + pubDate.getMinutes() + ' ';
      $list.append($('<li></li>').append(datetime).append(link));
    });

  });

  var request2 = $.ajax({
    type: "GET",
    url: 'getFeedRss/benzene/10',
    dataType: "jsonp",
    contentType: "application/jsonp; charset=utf-8",
    jsonp: 'callback',
    jsonpCallback: 'parseResponse',
    crossDomain: true
  });

  request2.fail(function(jqXHR, textStatus) {
   //$('#client_response_2').append('<pre style="color:red">The Rss Feeds not running. Please run ruby ruby rssFeedScheduler.rb and ruby rssFeedServer.rb</pre>');
    
  });
  request2.done(function(data) {
    var $list = $('<ul></ul>');
    $('#client_response_2').append($list);

    $.each(data, function(index, element) {
      var link = $('<a></a>');
      link.attr('href', element.link);
      link.attr('title', element.description);
      link.append(element.title);
      var pubDate = new Date(Date.parse(element.pubDate));
      var datetime = pubDate.getMonth() + 1 + '/' + pubDate.getDate() + '/' + pubDate.getFullYear() + ' - ' + pubDate.getHours() + ':' + pubDate.getMinutes() + ' ';
      $list.append($('<li></li>').append(datetime).append(link));
    });

  });

});