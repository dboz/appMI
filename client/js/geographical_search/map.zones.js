var zones = [0,1,2,3,4,5,6,7,8];

function addZoneByIndex(zone) {
  
   var url = 'http://www.insidemilan.it/layers/getZone/' + zone;
  console.log(url); 
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
      var vectorLayer = new OpenLayers.Layer.Vector("Zone:"+zone);

      var geojson_format = new OpenLayers.Format.GeoJSON({
         'internalProjection': new OpenLayers.Projection("EPSG:900913"),
         'externalProjection': new OpenLayers.Projection("EPSG:4326")
      });

      mapViewer.map.addLayer(vectorLayer);
      vectorLayer.addFeatures(geojson_format.read(geojson));
   });
}

function removeZoneByIndex(zone){
  var layer = mapViewer.map.getLayersByName("Zone:"+zone);
  mapViewer.map.removeLayer(layer[0]);
  console.log(layer);
}

function addAllZoneByIndex() {
   var url = 'http://localhost:8081/getZones';
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
      var vectorLayer = new OpenLayers.Layer.Vector("All zones");

      var geojson_format = new OpenLayers.Format.GeoJSON({
         'internalProjection': new OpenLayers.Projection("EPSG:900913"),
         'externalProjection': new OpenLayers.Projection("EPSG:4326")
      });

      mapViewer.map.addLayer(vectorLayer);
      vectorLayer.addFeatures(geojson_format.read(geojson));
   });
}

var data_zones = [
  {
    name: 'Zona 1',
    value:0,
    active:false,
    url: 'http://www.insidemilan.it/layers/getZone/0'
  },
  {
    name: 'Zona 2',
    value:1,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/1'
  },
  {
    name: 'Zona 3',
    value:2,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/2'
  },
  {
    name: 'Zona 4',
    value:3,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/3'
  },
  {
    name: 'Zona 5',
    value:4,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/4'
  },
  {
    name: 'Zona 6',
    value:5,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/5'
  },
  {
    name: 'Zona 7',
    value:6,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/6'
  },
  {
    name: 'Zona 8',
    value:7,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/7'
  },
  {
    name: 'Zona 9',
    value:8,
    active:false,
     url: 'http://www.insidemilan.it/layers/getZone/8'
  }
];

