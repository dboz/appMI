(function ($) {

  AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
    
    beforeRequest: function () {
      $(this.target).show();
      $(this.target).empty();
    },
/*
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
*/
    afterRequest: function () {
      
      $(this.target).empty();

      
     console.log(this.manager.response.response);
      for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
        var doc = this.manager.response.response.docs[i];
        var $element = $('<div class="result-item"></div>');
        var $name = $('<h3></h3>');
        if(doc.name === undefined)
        $name.append('Nome non presente');
          else  
        $name.append(doc.name);
        
        $element.append($name);
        $(this.target).append($element);
        console.log(doc);
      }
     slider.reloadSlider(); 
    },

    init: function () {
      //TODO
    }
  });

})(jQuery);