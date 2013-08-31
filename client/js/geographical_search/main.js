var checkMapViewer = true;
var mapViewer;

$(document).ready(function() {
  mapViewer = new MapOL();
  createMapViewer('map');

});

function createMapViewer(div) {

  //create basemap
  var baseMap = new OpenLayers.Layer.OSM('STREETS');
  baseMap.numZoomLevels = 11;

  var arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
    "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
    "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
    "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"];

  var mapQuest = new OpenLayers.Layer.OSM("TOPO", arrayOSM);
  /*
   var baseAerial = new OpenLayers.Layer.Bing('AERIAL', {
   key: 'AtvXwjiVtL1UiVgtKFRXEPjLwZ5-6HAFodUF2vdj1tCjdzmDKHvIiQgX1dGH6P8R',
   type: "Aerial"
   });
   //baseAerial.name = 'SATELLITE'; per bing vedere http://trac.osgeo.org/openlayers/changeset/11059
   */
  var clearBaseLayer = new OpenLayers.Layer("Minimal", {isBaseLayer: true});

  var controls = new Array();

  controls.push(new OpenLayers.Control.PanZoomBar());

  var mousePosition = new OpenLayers.Control.MousePosition({
    div: document.getElementById('mouse-position'),
    separator: " | Lat ",
    prefix: "Lon ",
    suffix: "",
    emptyString: 'No mouse'
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
  controls.push(new OpenLayers.Control.Navigation());

  //Set map
  mapViewer.addDiv(div);
  mapViewer.createMap();
  mapViewer.setProjection(new OpenLayers.Projection('EPSG:900913'));
  mapViewer.map.displayProjection = new OpenLayers.Projection('EPSG:4326');

  mapViewer.addControls(controls);

  mapViewer.setMaxExtent(new OpenLayers.Bounds(-180, -90, 180, 90));
  mapViewer.setMaxResolution('auto');
  mapViewer.setMinResolution('auto');



  mapViewer.addBasemap(baseMap);
  //mapViewer.addBasemap(mapQuest);
  //mapViewer.addBasemap(baseAerial);

  //mapViewer.addBasemap(openStreetMap);
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position = new OpenLayers.LonLat(9.189, 45.47).transform(fromProjection, toProjection);
  mapViewer.map.setCenter(position, 12);




  mapViewer.addLayer(clearBaseLayer);
  //mapViewer.map.events.register("zoomend",mapViewer.map, function(){});
  //mapViewer.map.events.register('changelayer', mapViewer.map, function(evt){});



  
  /*
  var allBasemap = mapViewer.getAllBasemap();
  for (var j = 0; j < allBasemap.length; j++) {
    var $button = $('<button></button>');
    
    $button.attr('id', 'basemap_button_' + j);
    $button.addClass('basemap_button');
    $button.append(allBasemap[j].name);
    $button.button();
    $button.css({
      '-webkit-transform': 'rotate(90deg) !important',
    '-moz-transform': 'rotate(90deg) !important',
    '-o-transform': 'rotate(90deg) !important',
    '-ms-transform': 'rotate(90deg) !important',
    'transform': 'rotate(90deg) !important' 
    })
    //$button.css('font-size', '10px');
    //$button.css('width', '120px');
    $($button).click({
      basemap: allBasemap[j]
    },
    function(evt) {
      var basemap = evt.data.basemap;
      mapViewer.map.setBaseLayer(basemap);

    });

    $('#map-controls').append($button);
  }
*/
}

var zones;
var layers;

$(document).ready(function() {
  zones = new Zones();
  var $navigation_left = $('#navigation-left');
  $.each(zones.data_zones, function(index, value){
      var $button = $('<div></div>');
      $button.addClass('navigation-button-style');
      $button.append(value.name);
      
      $button.click({
        item:value
      },
      function(evt){
        if(zones.isActiveZone(evt.data.item.value) === false){
          zones.addZoneByIndex(evt.data.item.value);
          $('.navigation-button-style').css('background-color',"#3F484F").css('color','#959899');
          $(this).css('background-color',"#959899").css('color','#3F484F')
        }else{
          zones.removeZoneByIndex(evt.data.item.value);
          $(this).css('background-color',"#3F484F").css('color','#959899');
        }
        
      });
      $navigation_left.append($button);
  });
});


$(document).ready(function() {
  layers = new Layers();
  $.each(layers.data_layers,function(index, value){
     var $button = $('<span></span>');
      $button.addClass('navigation-button-layer-style');
      $button.append(value.name);
      
      $button.click({
        item:value
      },
      function(evt){
        var layer = evt.data.item;
        console.log(layer);
        if(layers.isActive(layer) === false)
          layers.addLayer(layer);
        else
          layers.removeLayer(layer);
      });
      $('#layers-overlay').append($button);
    
  });
});



/*
 * 

 */