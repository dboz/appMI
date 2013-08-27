(function($) {

  AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractFacetWidget.extend({
    init: function() {
      var self = this;
      return;
      $(this.target).find('input').bind({
        keydown: function(e) {
          if (e.which === 13) {
            var value = $(this).val().trim();
            if (value && self.add(value)) {
              self.manager.doRequest(0);
              self.requestSent = true;
            }
          }
        },
        click: function() {
          var value = $(this).val().trim();
          if (value && self.add(value)) {
            self.manager.doRequest(0);
            self.requestSent = true;
          }
        }
      });

      $("#query").bind({
        // don't navigate away from the field on tab when selecting an item
        keydown: function(event) {
          if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
            event.preventDefault();
          }
        },
        click: function(event) {
          if ($(this).data("autocomplete").menu.active) {
            event.preventDefault();
          }
        }

      });
      var params = ['q=*:*&facet=true&facet.limit=20&facet.mincount=1&facet.sort=count&json.nl=map'];
      for (var i = 0; i < self.fields.length; i++) {
        params.push('facet.field=' + self.fields[i]);
      }
      var url = self.manager.solrUrl + 'select?' + params.join('&') + '&fl=' + fl.join(',') + '&wt=json&json.wrf=?';
    },
    afterRequest: function() {
      //      $(this.target).find('input').val('');
      var self = this;
      var callback = function(response) {
        var list = [];
        for (var i = 0; i < self.fields.length; i++) {
          var field = self.fields[i];
          for (var facet in response.facet_counts.facet_fields[field]) {
            list.push({
              field: field,
              value: facet,
              text: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
            });
          }
        }
        self.requestSent = false;
        $("#query").bind("keydown", function(event) {
          if ($(this).val().trim().length > 0) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
              event.preventDefault();
            }
            else if (event.keyCode === $.ui.keyCode.ENTER) {
              var value = $(this).val().trim();
              var multiFilterQuery = new MultiFilterQuery();
              $.each(self.fields, function(index,element){
                multiFilterQuery.addFilter(element, value);
              });
              //self.manager.store.addByValue('fq', '(text:"' + value + '" OR text_multilingual:"' + value + '" )');
              self.manager.store.addByValue('fq', multiFilterQuery.getFilterQueryOR());
              
              self.manager.doRequest(0);
              self.requestSent = true;
              $(this).autocomplete("close");
              $(this).val('');
            }
          }
        }).autocomplete({
          minLength: 1,
          source: function(request, response) {
            var t = jQuery.trim(request.term);
            if (t.length === 0) {
              response([]);
            }
            else {
              var terms = [t];//t.split(" ");
              var queue = [];
              //var fq = 'fq=' + filterQuery.filterQuery;
              

              for (var i = 0; i < self.fields.length; i++) {
                for (var j = 0; j < terms.length; j++) {
                  //var p = 'facet.field=' + self.fields[i] + '&f.' + self.fields[i] + '.facet.prefix=' + t;
                  var t_ci = terms[j].toLowerCase();
                  var p = 'facet.field=' + self.fields[i] + '&f.' + self.fields[i] + '.facet.prefix=' + t_ci;// + '&fq=text:' + t_ci;
                  //var params = [ 'q=' + createBBoxQuery(),fq, 'facet=true&facet.limit=10&facet.mincount=1&facet.sort=count&json.nl=map' ];
                  //var params = [ 'q=*:*',fq, 'facet=true&facet.limit=10&facet.mincount=1&facet.sort=count&json.nl=map' ];
                  var params = ['facet=true&facet.limit=50&facet.mincount=1&facet.sort=count&json.nl=map'];
                  params.push(p);
                  params.push('q=*:*');
                  

                  var url = self.manager.solrUrl + 'select?' + params.join('&') + '&fl=' + fl.join(',') + '&wt=json&json.wrf=?';
                  queue.push(url);
                }
              }

              self.createSuggester(queue, response);
            }
          },
          select: function(event, ui) {
            // Click on element of the list  
            // var value = $(this).val().trim();
            
            var value = ui.item.value;
            var field = ui.item.field;
            if (value !== undefined && field !== undefined) {
              if (value.length > 0) {
                this.value = value;
                if (value && self.manager.store.addByValue('fq', field + ':"' + value + '"')) {
                  self.manager.doRequest(0);
                  self.requestSent = true;
                  $(this).autocomplete("close");
                  $(this).val('');
                  createResults();
                }
              }
            }
            return false;
          },
          open: function() {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            $('.ui-menu-item').css('font-size', '11px');
            $('.ui-autocomplete.ui-menu').css('z-index', 9999999);
          },
          close: function() {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
          }
        });
        return;
      }
      //var params = [ 'q=' + createBBoxQuery(), 'facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
      var params = ['q=*:*', 'facet=true&facet.limit=-1&facet.mincount=1&json.nl=map'];
      for (var i = 0; i < this.fields.length; i++) {
        if ($('#query').val().trim().length > 0) {
          params.push('facet.field=' + this.fields[i] + '&f.' + self.fields[i] + '.facet.prefix=' + $('#query').val().trim());
        }
      }

      jQuery.getJSON(self.manager.solrUrl + 'select?' + params.join('&') + '&rows=0&wt=json&json.wrf=?', {}, callback);
    },
    createSuggester: function(urls, response) {
      var queue = urls;
      var list = [];
      function qNext() {
        if (queue.length === 0) {
          response(list);
          return;
        }
        else {
          var url = queue[0];
          var request = $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            context: this,
            timeout: 1000
          });
          request.success(function(data) {
            if (data.facet_counts !== undefined) {
              $.each(_.keys(data.facet_counts.facet_fields), function(index, field) {
                for (var facet in data.facet_counts.facet_fields[field]) {
                  list.push({
                    field: field,
                    value: facet,
                    label: facet + ' (' + data.facet_counts.facet_fields[field][facet] + ')'
                  });
                }
                ;
              });
            }
          });
          request.error(function() {
            qNext();
          });
          request.complete(function() {
            queue.shift();
            qNext();
          });
        }
      }
      qNext(this.fields);
    }

  });
})(jQuery);

