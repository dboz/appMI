function createBaseMap(){
  var basemap = new OpenLayers.Layer.ArcGISCache('World', defaultUrl, {
    tileOrigin: agsTileOrigin,
    resolutions: defaultRes,
    maxExtent: defaultExtent,
    useArcGISServer: false,
    isBaseLayer: true,
    type: 'jpg',
    projection: defaultPrj,
    attribution: attribution
  });
  return basemap;
}