function Zones() {
  this.zones = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  this.data_zones = [
    {
      name: 'Zona 1',
      value: 0,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/0'
    },
    {
      name: 'Zona 2',
      value: 1,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/1'
    },
    {
      name: 'Zona 3',
      value: 2,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/2'
    },
    {
      name: 'Zona 4',
      value: 3,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/3'
    },
    {
      name: 'Zona 5',
      value: 4,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/4'
    },
    {
      name: 'Zona 6',
      value: 5,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/5'
    },
    {
      name: 'Zona 7',
      value: 6,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/6'
    },
    {
      name: 'Zona 8',
      value: 7,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/7'
    },
    {
      name: 'Zona 9',
      value: 8,
      active: false,
      url: 'http://www.insidemilan.it/layers/getZone/8'
    }
  ];


  this.addZoneByIndex = function(zone) {
    var self = this;
    var url = 'http://www.insidemilan.it/layers/getZone/' + zone;

    var get_zones = $.ajax({
      type: "GET",
      url: url,
      dataType: "jsonp",
      contentType: "application/jsonp; charset=utf-8",
      jsonp: 'callback',
      jsonpCallback: 'parseGeojson',
      crossDomain: true
    });

    get_zones.done(function(geojson) {
      
      $.each(self.data_zones, function(index, value){
        if(value.active === true){
          var layer = mapViewer.map.getLayersByName("Zone:" + value.value);
          mapViewer.map.removeLayer(layer[0]);
          value.active = false;
        }
      });
      
      var vectorLayer = new OpenLayers.Layer.Vector("Zone:" + zone);

      var geojson_format = new OpenLayers.Format.GeoJSON({
        'internalProjection': new OpenLayers.Projection("EPSG:900913"),
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
      });

      mapViewer.map.addLayer(vectorLayer);
      vectorLayer.addFeatures(geojson_format.read(geojson));
      var params = [];
      $.each(ManagerTextSearch.store.values('fq'), function(index, fq) {
        params.push(fq);

      });

      $.each(params, function(index, value) {
        ManagerTextSearch.store.removeByValue('fq', value);
      });
      
      var zone_offset = zone + 1;
      ManagerTextSearch.store.addByValue('fq', 'zone:' + zone_offset);
      ManagerTextSearch.doRequest(0);
      self.data_zones[zone].active = true;
    });
  };

  this.removeZoneByIndex = function(zone) {
    var layer = mapViewer.map.getLayersByName("Zone:" + zone);
    mapViewer.map.removeLayer(layer[0]);
    var zone_offset = zone + 1;
    ManagerTextSearch.store.removeByValue('fq', 'zone:' + zone_offset);
    ManagerTextSearch.doRequest(0);
    this.data_zones[zone].active = false;
  };
  
  this.getZone = function(zone){
    return this.data_zones[zone];
  };
  
  this.isActiveZone = function(zone){
    return this.data_zones[zone].active;
  };

}








