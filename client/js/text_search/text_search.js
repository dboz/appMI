var ManagerTextSearch;

(function($) {

  $(function() {

    ManagerTextSearch = new AjaxSolr.Manager({
      solrUrl: solrUrl
    });

    ManagerTextSearch.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text-search',
      target: '#search',
      field: 'text',
      fields: ['text']
    }));

    ManagerTextSearch.addWidget(new AjaxSolr.ResultWidget({
      id: 'results-by-text-search',
      target: '#results-by-text-search'
    }));

    var hashStore = new AjaxSolr.ParameterHashStore();
    ManagerTextSearch.setStore(hashStore);
    //ManagerTextSearch.store.exposed = ['fq', 'q', 'start', 'facet', 'facet.query', 'facet.field', 'facet.mincount', 'facet.count'];

    ManagerTextSearch.init();
    ManagerTextSearch.store.addByValue('q', '*:*');

    var params = {
      'facet': true,
      'facet.field': ['category', 'sub_category'],
      'facet.mincount': 1,
      'json.nl': 'map',
      'ht': 'true',
      'fl': ['name','description','category', 'place'],
      'sort': 'name desc'
    };

    for (var name in params) {
      ManagerTextSearch.store.addByValue(name, params[name]);
    }
    ManagerTextSearch.doRequest();
  });
})(jQuery);

