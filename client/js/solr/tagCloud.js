(function ($) {

  AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
    beforeRequest: function () {

    },
    afterRequest: function () {
    
      if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
        $(this.target).html(AjaxSolr.theme('no_items_found'));
        return;
      }
      
      
      var objectedItems = [];
      for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
        var label = facet;
        var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
        if (label.length > 0 ) {
          objectedItems.push({
            facet: facet, 
            label: label,
            count: count
          });
        }
      }
      
      objectedItems.sort(function (a, b){
            return ((a.label < b.label) ? -1 : ((a.label > b.label) ? 1 : 0));
       });
      
      
    

      $(this.target).empty();
      
      
      for (var i = 0; i < objectedItems.length;i++) {
        var facet = objectedItems[i].facet;
        var label = objectedItems[i].label;
        $(this.target).append(
      $('<a href="#" class="tagcloud_item"></a>')
      .text(facet)
      .addClass('tagcloud_size_' + parseInt(objectedItems[i].count))
      .click(this.clickHandler(facet))
    );
   
      }
      
    }
  });

})(jQuery);
