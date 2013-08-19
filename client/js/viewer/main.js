var checkMapViewer = true;
var mapViewer;

$(document).ready(function() {
  mapViewer = new GeneralMap();
  console.log('test');
  createMapViewer('map-viewer');
 
});

function createMapViewer(div){
  checkMapViewer = false;
  
  //create basemap
  var baseMap = new OpenLayers.Layer.OSM();;
   
  // Configuring scales
  //var scales = conf.scales;
  //var resolutions = [];
    
  //OpenLayers.DOTS_PER_INCH = 96;//.0655715638715;
  //OpenLayers.Util.DEFAULT_PRECISION = 16;
  //for(var i = 0; i < scales.length; i++) {
  //  resolutions.push(OpenLayers.Util.getResolutionFromScale(scales[i], 'degrees'));
  //}
    
  // Create controls
  var controls = new Array();
    
  controls.push(new OpenLayers.Control.PanZoomBar({
    zoomWorldIcon: true
  }));
    
  var mousePosition = new OpenLayers.Control.MousePosition({
    div: document.getElementById('mouse-position'),
    separator:" | Lat ",
    prefix : "Lon ",
    suffix:"",
    emptyString: 'Mouse is not over map.'
  });
  controls.push(mousePosition);
    
  var doubleScaleLine = new OpenLayers.Control.DoubleScaleLine();
  doubleScaleLine.setDiv('double-scale-line');
    
  var extendedScale = new OpenLayers.Control.ExtendedScale();
  extendedScale.setDiv('extended-scale');
  controls.push(extendedScale);
  controls.push(doubleScaleLine);
  controls.push(new OpenLayers.Control.ArgParser());
  controls.push(new OpenLayers.Control.Attribution());
  controls.push(new OpenLayers.Control.LoadingPanel({notification:false}));
  controls.push(new OpenLayers.Control.Navigation());
  controls.push(new OpenLayers.Control.ProgressBar({
    div: document.getElementById('progress-bar-content')
  }));
  
  //Set map
  mapViewer.addDiv(div);
  mapViewer.addControls(controls);
  var panel = new OpenLayers.Control.Panel();
  panel.addControls([new OpenLayers.Control.FullScreen()]);
    
  //Create map
  mapViewer.createMap();
  mapViewer.addControl(panel);
  mapViewer.setProjection(new OpenLayers.Projection('EPSG:900913'));
  mapViewer.setMaxExtent(new OpenLayers.Bounds(-180, -90, 180, 90)); 
  mapViewer.setMaxResolution('auto');
  mapViewer.setMinResolution('auto');
  //var restricted_extent = new OpenLayers.Bounds(conf.restricted_extent.west, conf.restricted_extent.south, conf.restricted_extent.east, conf.restricted_extent.north );
  //mapViewer.map.restrictedExtent = restricted_extent;
  //mapViewer.setResolutions(resolutions);
                        
  /* OpenstreetMap */
  //var openStreetMap = OpenStreetBasemap();
  
  /* Satellite */
  //var satellite = new gmesCore003MosaicDanube();
  //var satellite = new gmesCore003MosaicDanube18();
  
  /* Terracolor
  var satelliteBasemap = new SatelliteBasemap();
  satelliteBasemap.setStandard();
  var terracolor = satelliteBasemap.getSatelliteBasemap();
  */
 
  // Add basemaps
  
  //mapViewer.addLayer(satellite.getBasemap());
  mapViewer.addBasemap(baseMap);
  //mapViewer.addBasemap(openStreetMap);
  mapViewer.setCenterWithZoom(19.5,46,5);
  
  
  
   var clearBaseLayer = new OpenLayers.Layer("No Background", {isBaseLayer: true}); 
   mapViewer.addLayer(clearBaseLayer);
  //mapViewer.map.events.register("zoomend",mapViewer.map, function(){});
  //mapViewer.map.events.register('changelayer', mapViewer.map, function(evt){});
    
   
  var  allBasemap = mapViewer.getAllBasemap();
  for(var j=0; j < allBasemap.length; j++){
    var $button = $('<button></button>');
    $button.attr('id','basemap_button_' + j);
    $button.attr('class','basemap_button');
    $button.append(allBasemap[j].name);
    $button.button();
    $button.css('font-size','10px');
    $button.css('width','120px');
    $($button).click({
      basemap:allBasemap[j]
    },
    function(evt){
      var basemap = evt.data.basemap;
      mapViewer.map.setBaseLayer(basemap);
          
    });
      
    $('#basemap-controls').append($button);
  }
  
}
