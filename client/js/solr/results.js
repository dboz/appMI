(function($) {

  AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
    beforeRequest: function() {
      $(this.target).show();
      $(this.target).empty();
    },
    
     facetLinks: function (facet_field, facet_values) {
     var links = [];
     if (facet_values) {
     for (var i = 0, l = facet_values.length; i < l; i++) {
     links.push(AjaxSolr.theme('facet_link', facet_values[i], this.facetHandler(facet_field,  facet_values[i])));
     }
     }
     return links;
     },
     
     facetHandler: function (facet_field, facet_value) {
     var self = this;
     return function () {
     //        self.manager.store.remove('fq');
     self.manager.store.addByValue('fq', facet_field + ':' + '"' + facet_value + '"' );
     self.manager.doRequest(0);
     return false;
     };
     },
    
    afterRequest: function() {

      $(this.target).empty();


      console.log(this.manager.response.response);
      for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
        var doc = this.manager.response.response.docs[i];
        $(this.target).append(generateItem(doc));
        
      }
      slider.reloadSlider();
    },
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
  var $description = $('<div></div>');
  $.each(solrDocument.description,function(index, d){
    $description.append($('<p></p>').append(d));
  });
  $left.append($description);
  
  var $contact = $('<div></div>');
  if(solrDocument.email !== undefined || solrDocument.email === 'empty')
    $contact.append($('<p></p>').append('E-mail: ' + solrDocument.email));
  if(solrDocument.telephone !== undefined || solrDocument.telephone === 'empty')
    $contact.append($('<p></p>').append('Telefono: ' + solrDocument.telephone));
  if(solrDocument.fax !== undefined || solrDocument.fax === 'empty')
    $contact.append($('<p></p>').append('Fax: ' + solrDocument.fax));
  if(solrDocument.url !== undefined || solrDocument.url === 'empty')
    $contact.append($('<p></p>').append('Website: ' + solrDocument.url));
  $left.append($contact);
  
  $content.append($left);
  
  
  var $category = $('<div class="result-category"></div>');
  $category.append(solrDocument.category);
  if(solrDocument.sub_category !== undefined)
  $.each(solrDocument.sub_category,function(index, sc){
    $category.append('<br/>');
    $category.append(sc);
  });
  
  $content.append($category);
  
  return $content;

}


 