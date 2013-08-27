(function($) {

 AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
  beforeRequest: function() {

  },
  afterRequest: function() {

   if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
    $(this.target).html(AjaxSolr.theme('no_items_found'));
    return;
   }


   var items = [];
   for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
    var label = facet;
    var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
    if (label.length > 0) {
     items.push({
      facet: facet,
      label: label,
      count: count
     });
    }
   }
   
   for (var facet in this.manager.response.facet_counts.facet_fields['sub_category']) {
    var label = facet;
    var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
    if (label.length > 0) {
     items.push({
      facet: facet,
      label: label,
      count: count
     });
    }
   }

   items.sort(function(a, b) {
    return ((a.count < b.count) ? -1 : ((a.count > b.count) ? 1 : 0));
   });




   // $(this.target).empty();


   /*for (var i = 0; i < objectedItems.length; i++) {
    var facet = objectedItems[i].facet;
    var label = objectedItems[i].label;
    $(this.target).append(
    $('<a href="#" class="tagcloud_item"></a>')
    .text(facet)
    .addClass('tagcloud_size_' + parseInt(objectedItems[i].count))
    .click(this.clickHandler(facet))
    );
    
    }*/
   //http://advitum.de/2012/04/tagcloud-mit-php-und-javascript-erstellen-word-cloud-d3/
   //var maxCount = items[items.length - 1].count;

   var wordcloud, size = [800, 300];

   var fill = d3.scale.category20c();
   console.log('tagcloud')
   function draw(words) {
    wordcloud = d3.select('#tag-cloud').append("svg")
            .attr("width", size[0])
            .attr("height", size[1])
            .append("g")
            .attr("transform", "translate(" + (size[0] / 2) + "," + (size[1] / 2) + ")");

    wordcloud.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) {
     return d.size + "px";
    }).style("font-family", "Impact")
    .style('cursor', 'pointer')
      .style('cursor', 'hand')
      .style("fill", function(d, i) {
     return fill(i);
    }).attr("text-anchor", "middle")
      
      .attr("transform", function(d) {
         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      }).text(function(d) {
               return d.text;
      })
      .on("click", function(d,i) { console.log(d); })
   }


   d3.layout.cloud().size(size)
           .words(items.map(function(d) {
    return {text: d.label, size: 10};
   }))
           .padding(5)
           .rotate(function(d) {

    return d.text.length > 10 ? 0 : ~~(Math.random() * 5) * 30 - 60;
   })
           .font("Impact")
           .fontSize(function(d) {
    return 20;
   })
           .on("end", draw)
           .start();














  }






 });










})(jQuery);


