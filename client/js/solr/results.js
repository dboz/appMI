(function($) {

  AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
    beforeRequest: function() {
      $(this.target).show();
      $(this.target).empty();
    },
    facetLinks: function(facet_field, facet_values) {
      var links = [];
      if (facet_values) {
        for (var i = 0, l = facet_values.length; i < l; i++) {
          links.push(AjaxSolr.theme('facet_link', facet_values[i], this.facetHandler(facet_field, facet_values[i])));
        }
      }
      return links;
    },
    facetHandler: function(facet_field, facet_value) {
      var self = this;
      return function() {
        //        self.manager.store.remove('fq');
        self.manager.store.addByValue('fq', facet_field + ':' + '"' + facet_value + '"');
        self.manager.doRequest(0);
        return false;
      };
    },
    afterRequest: function() {

      $(this.target).empty();

      for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
        var doc = this.manager.response.response.docs[i];
        $(this.target).append(generateItem(doc));

      }

    }
    ,
    init: function() {
      //TODO
    }
  });

})(jQuery);

function generateItem(solrDocument) {
  var $content = $('<div></div>');
  $content.addClass('result-item');

  var $left = $('<div></div>');
  $left.addClass('result-left');

  var $name = $('<h3></h3>');
  if (solrDocument.name === undefined)
    $name.append('Nome non presente');
  else
    $name.append(solrDocument.name);
  $left.append($name);

  //var $address = $('<p></p>');
  //$address.append(solrDocument.address);
  //$left.append($address);
  //var $description = $('<div></div>');
  //$.each(solrDocument.description, function(index, d) {
  //  $description.append($('<p></p>').append(d));
  //});
  //$left.append($description);

  var $contact = $('<div></div>');
  if (solrDocument.email !== undefined)
    $contact.append($('<p></p>').append('E-mail: ' + solrDocument.email));
  if (solrDocument.telephone !== undefined)
    $contact.append($('<p></p>').append('Telefono: ' + solrDocument.telephone));
  if (solrDocument.fax !== undefined)
    $contact.append($('<p></p>').append('Fax: ' + solrDocument.fax));
  if (solrDocument.url !== undefined)
    $contact.append($('<p></p>').append('Website: ' + solrDocument.url));
  //if (solrDocument.place !== undefined)
  //  $contact.append($('<p></p>').append('Coordinates: ' + solrDocument.place));
  $left.append($contact);

  $content.append($left);


  var $category = $('<div class="result-category"></div>');
  var categories = [];
  categories.push(solrDocument.category);
  if (solrDocument.sub_category !== undefined)
    categories = _.union(solrDocument.sub_category, categories);

  $.each(_.uniq(categories), function(index, sc) {
    $category.append('<spa style="padding-right:10px">' + _.capitalize(sc) + '</span>');
    $category.append();
  });

  $content.append($category);

  var $to_map = $('<a></a>');
  $to_map.attr('title', 'Visualizza sulla mappa');
  $to_map.css('position', 'absolute').css('top', '5px').css('right', '40px').css('z-index', '50').css('cursor', 'pointer').css('cursor', 'hand');
  var $to_map_icon = $('<img height="28" width="28" src="images/globe_grey.png"></img>');
  $to_map.append($to_map_icon);
  $content.append($to_map);
  
  $to_map.click({document: solrDocument}, function(evt) {
    var place = evt.data.document.place;
    var name = evt.data.document.name;
    var address = evt.data.document.address;
    var lat = place.split(',')[0];
    var long = place.split(',')[1];
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(long, lat).transform(fromProjection, toProjection);
    var content = $('<div></div>');
    content.append($('<h3></h3>').append(name));
    content.append($('<p></p>').append(address));
    content.append('<p>LAT: ' + lat + ', LON: ' + long + '</p>');
    mapViewer.addMarker(position, 12, content[0].outerHTML);

  });
  
  
  if (solrDocument.name !== undefined && solrDocument.name !== undefined) {
    var $twitts = $('<a></a>');
    $twitts.attr('title', 'Twitts');
    $twitts.css('position', 'absolute').css('top', '5px').css('right', '5px').css('z-index', '50').css('cursor', 'pointer').css('cursor', 'hand');
    var $twitts_icon = $('<img src="images/twitter_grey.png"></img>');

    $twitts.append($twitts_icon);
    $content.append($twitts);

    $twitts.click({document: solrDocument}, function(evt) {
      var document = evt.data.document;
      var name = document.name;
      var place = document.place;
      var lat = place.split(',')[0];
      var long = place.split(',')[1];

      var query = name.split('.').join('').split('/').join('').split(':').join('');
      query = query.split(' ').join('+');

      var get_twitts = $.ajax({
        type: "GET",
        url: 'http://www.insidemilan.it/layers/getInfoByTwitter/' + query + '/' + lat + '/' + long,
        dataType: "jsonp",
        contentType: "application/jsonp; charset=utf-8",
        jsonp: 'callback',
        jsonpCallback: 'parseTwitts',
        crossDomain: true
      });

      get_twitts.done(function(twitts) {
        var values = twitts['statuses'];
        $('.response_twitts').remove();
        var $response_twitts = $('<div class="response_twitts"></div>');
        $content.append($response_twitts);

        if (values === undefined) {
          $response_twitts.append('Nessun twitts per questa risorsa');
        } else {
          if (values.length > 0) {
            $.each(twitts['statuses'], function(index, value) {
              $response_twitts.append('<p>' + value.text + '</p>');
            });
          } else {
            $response_twitts.append('Nessun twitts per questa risorsa');
          }
        }

      });
    });
  }


  return $content;

}





 