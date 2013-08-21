


var solrUrl = 'http://www.insidemilan.it/solr/appmi/';


(function($) {

  $(function() {

    

    Manager = new AjaxSolr.Manager({
      solrUrl: solrUrl
    });
    
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: "tag-cloud",
        target: '#tag-cloud',
        field: 'category'
     }));
   
   /*
   Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#list_of_documents'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function(perPage, offset, total) {
        $('#pager-header').html($('<span/>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' out of ' + total + ' results'));
      }
    }));

    for (var i = 0, l = tag_fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: tag_fields[i],
        target_body: '#' + tag_fields[i] + '-body',
        target: '#' + tag_fields[i],
        field: tag_fields[i],
        gfield: gtag_fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.CurrentSearchWidgetFreeText({
      id: 'currentfreetextsearch',
      target: '#current-search-box'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      field: 'text',
      fields: ['text', 'text_multilingual']
    }));
    Manager.addWidget(new AjaxSolr.TextWidget({
      id: 'freeText',
      target: '#searchFreeText'
    }));
    Manager.addWidget(new AjaxSolr.CountryCodeWidget({
      id: 'countries',
      target: '#countries',
      field: 'countryCodes'
    }));
    Manager.addWidget(new AjaxSolr.ResourceTypeWidget({
      id: 'resource-type-panel',
      target: '#resource-type-panel',
      field: 'geoportalResourceType'
    }));
    if(checkIEVersion())
    Manager.addWidget(new AjaxSolr.CirclePacking({
      id: 'circle-packing',
      target: '#circle-packing'
    }));
    /*
     Manager.addWidget(new AjaxSolr.CalendarWidget({
     id: 'timeline',
     target: '#timeline',
     field: 'dateOfPublication'
     }));
     */
    
    var hashStore = new AjaxSolr.ParameterHashStore();
    Manager.setStore(hashStore);
    Manager.store.exposed = ['fq', 'q', 'start', 'facet', 'facet.query', 'facet.field', 'facet.mincount', 'facet.count'];

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    
    //filterQuery = new FilterQuery('{!tag=grt}' + conf.default_field_for_filter);
    /*    
     filterQuery.addFilterQueryOR('dataset');
     filterQuery.addFilterQueryOR('series');
     */
    //for (var i = 0; i < conf.defaultORFilters.length; i++) {
    //  filterQuery.addFilterQueryOR(conf.defaultORFilters[i]);
    //}
    //filterQuery.addFilterQueryOR('layer');
    //filterQuery.addFilterQueryOR('service');


    var params = {
      'facet': true,
      'facet.field': ['category','sub_category'],
      //'facet.query': '-memberStateCountryCode:[* TO *]',
      'facet.mincount': 1,
      'json.nl': 'map',
      'ht': 'true',
      'fl': 'name'
      //'sort': getSortClause()
      //'fq': filterQuery.filterQuery
    };

    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });

  

})(jQuery);

