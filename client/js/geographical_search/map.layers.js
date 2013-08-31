function Layers(){
  
  this.data_layers = [
  {
    name: 'Stazioni metro',
    active:false,
    url: 'http://www.insidemilan.it/layers/getMetroStations'
  },
  {
    name: 'Metro',
    active:false,
      url: 'http://www.insidemilan.it/layers/getMetroLines'
  },
  {
    name: 'Stazioni Treni',
    active:false,
    url: 'http://www.insidemilan.it/layers/getTrainStation'
  },
  {
    name: 'Ferrovie',
    active:false,
    url: 'http://www.insidemilan.it/layers/getRails'
  }
  ,
  /*
  {
    name: 'Aree Cani',
    active:false,
    url: 'http://www.insidemilan.it/layers/getDogZone'
 },
  {
    name: 'Parchi',
    active:false,
    url: 'http://www.insidemilan.it/layers/getParks'
  },*/
  {
    name: 'Piste Ciclabili',
    active:false,
    url: 'http://www.insidemilan.it/layers/getBikePaths'
  }
  ];
  
  this.addLayer = function(layer) {
    var self = this;
    
    var get_zones = $.ajax({
      type: "GET",
      url: layer.url,
      dataType: "jsonp",
      contentType: "application/jsonp; charset=utf-8",
      jsonp: 'callback',
      jsonpCallback: 'parseGeojson',
      crossDomain: true
    });

    get_zones.done(function(geojson) {
      var vectorLayer = new OpenLayers.Layer.Vector(layer.name,{
        styleMap: new OpenLayers.StyleMap({
          pointRadius: 2, // based on feature.attributes.type
          fillColor: "#666666"
        }) 
      });

      var geojson_format = new OpenLayers.Format.GeoJSON({
        'internalProjection': new OpenLayers.Projection("EPSG:900913"),
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
      });

      mapViewer.map.addLayer(vectorLayer);
      vectorLayer.addFeatures(geojson_format.read(geojson));
      layer.active = true;
    });
  };
  
  this.removeLayer = function(layer) {
    var layerOL = mapViewer.map.getLayersByName(layer.name);
    mapViewer.map.removeLayer(layerOL[0]);
    layer.active = false;
  };
  
  this.isActive = function(layer){
    return _.findWhere(this.data_layers, layer).active;
  };
}


