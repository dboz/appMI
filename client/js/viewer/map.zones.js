var zones = [0,1,2,3,4,5,6,7,8];

function addZoneByIndex(zone) {
   var url = 'http://localhost:8081/getZone/' + zone;
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


