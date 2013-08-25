function getZones() {
   var get_zones = $.ajax({
      type: "GET",
      url: 'http://localhost:8081/getZone/0',
      dataType: "jsonp",
      contentType: "application/jsonp; charset=utf-8",
      jsonp: 'callback',
      jsonpCallback: 'parseGeojson',
      crossDomain: true
   });

   get_zones.done(function(geojson) {
      var vectorLayer = new OpenLayers.Layer.Vector("Zones");

      var geojson_format = new OpenLayers.Format.GeoJSON({
         'internalProjection': new OpenLayers.Projection("EPSG:900913"),
         'externalProjection': new OpenLayers.Projection("EPSG:4326")
      });

      mapViewer.map.addLayer(vectorLayer);
      vectorLayer.addFeatures(geojson_format.read(geojson));
   });
}


