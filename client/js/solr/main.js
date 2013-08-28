var fl = ['name'];
var solrUrl = 'http://www.insidemilan.it/solr/appmi/';

var Manager;

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

    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      field: 'text',
      fields: ['text']
    }));

    var hashStore = new AjaxSolr.ParameterHashStore();
    Manager.setStore(hashStore);
    //Manager.store.exposed = ['fq', 'q', 'start', 'facet', 'facet.query', 'facet.field', 'facet.mincount', 'facet.count'];

    Manager.init();
    Manager.store.addByValue('q', '*:*');

    var params = {
      'facet': true,
      'facet.field': ['category', 'sub_category'],
      'facet.mincount': 1,
      'json.nl': 'map',
      'ht': 'true',
      'fl': fl
      //'sort':
    };

    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });
})(jQuery);

