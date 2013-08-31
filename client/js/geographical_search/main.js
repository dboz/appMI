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

  controls.push(new OpenLayers.Control.PanZoomBar());

  var mousePosition = new OpenLayers.Control.MousePosition({
    div: document.getElementById('mouse-position'),
    separator: " | Lat ",
    prefix: "Lon ",
    suffix: "",
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
  // controls.push(new OpenLayers.Control.LoadingPanel({notification:false}));
  controls.push(new OpenLayers.Control.Navigation());
  //controls.push(new OpenLayers.Control.ProgressBar({
  //  div: document.getElementById('progress-bar-content')
  //}));
  var panel = new OpenLayers.Control.Panel();
  panel.addControls([new OpenLayers.Control.FullScreen()]);

  //Set map
  mapViewer.addDiv(div);
  mapViewer.createMap();
  mapViewer.setProjection(new OpenLayers.Projection('EPSG:900913'));
  mapViewer.map.displayProjection = new OpenLayers.Projection('EPSG:4326');


  //Create map

  mapViewer.addControls(controls);
  mapViewer.addControl(panel);

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



  //getZones();

  var allBasemap = mapViewer.getAllBasemap();
  for (var j = 0; j < allBasemap.length; j++) {
    var $button = $('<button></button>');
    $button.attr('id', 'basemap_button_' + j);
    $button.attr('class', 'basemap_button');
    $button.append(allBasemap[j].name);
    $button.button();
    $button.css('font-size', '10px');
    $button.css('width', '120px');
    $($button).click({
      basemap: allBasemap[j]
    },
    function(evt) {
      var basemap = evt.data.basemap;
      mapViewer.map.setBaseLayer(basemap);

    });

    $('#map-controls').append($button);
  }

}

var zones;
$(document).ready(function() {
  zones = new Zones();
  var $navigation_botton = $('#navigation-botton');
  
  var $transport = $('<button></button>');
  $transport.addClass('navigation-button-style');
  $transport.append('Trasporti');
  $transport.button();
  $transport.click(function(evt){
    if($('#layers-overlay').is(':visible'))
     $('#layers-overlay').hide();
   else
     $('#layers-overlay').show();
  });
  $navigation_botton.append($transport);
  
  $.each(zones.data_zones, function(index, value){
      var $button = $('<button></button>');
      $button.addClass('navigation-button-style');
      $button.append(value.name);
      $button.button();
      $button.click({
        item:value
      },
      function(evt){
        
        if(zones.isActiveZone(evt.data.item.value) === false){
          zones.addZoneByIndex(evt.data.item.value);
        }else{
          zones.removeZoneByIndex(evt.data.item.value);
        }
        
      });
      $navigation_botton.append($button);
  });
  
 
  
  var $layers_overlay = $('#layers-overlay-content');

  $.each(data_layers, function(index, value) {
    var $layer = $('<div class="layer-item"></div>');
    $layer.attr('id', 'layer_' + index);
    $layer.append($('<div class="layer-title"></div>').append(value.name));
    $layer.append($('<div></div>').attr('id', 'layer-svg-' + index).addClass('layer-svg'));

    $layers_overlay.append($layer);
  });
  
  slider = $('#layers-overlay-content').bxSlider({
    adaptiveHeight: true,
    pager:false,
    mode: 'fade',
    onSlideBefore: function($slideElement, oldIndex, newIndex) { // your code here }
      
      var id = '#' + 'layer-svg-' + newIndex;
      var url = data_layers[newIndex].url;

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

        
        var map = new SimpleMapD3({
          container: id,
          data: geojson,
          tooltipOn: true,
          graticuleOn: true,
          projection: 'equirectangular',
          mapDragOn: false,
          legendDragOn: false,
          styles: {
            "stroke-width": 0.05,
            "stroke": "steelblue",
            "fill": "none"
          },
          stylesBackground:{
            
          }
        });





      });

    }
  });

});



var data_layers = [
  /*{
    name: 'Zona 1',
    url: 'http://www.insidemilan.it/layers/getZone/0'
  },
  {
    name: 'Zona 2',
    url: 'http://www.insidemilan.it/layers/getZone/1'
  },
  {
    name: 'Zona 3',
    url: 'http://www.insidemilan.it/layers/getZone/2'
  },
  {
    name: 'Zona 4',
    url: 'http://www.insidemilan.it/layers/getZone/3'
  },
  {
    name: 'Zona 5',
    url: 'http://www.insidemilan.it/layers/getZone/4'
  },
  {
    name: 'Zona 6',
    url: 'http://www.insidemilan.it/layers/getZone/5'
  },
  {
    name: 'Zona 7',
    url: 'http://www.insidemilan.it/layers/getZone/6'
  },
  {
    name: 'Zona 8',
    url: 'http://www.insidemilan.it/layers/getZone/7'
  },
  {
    name: 'Zona 9',
    url: 'http://www.insidemilan.it/layers/getZone/8'
  },
  {
    name: 'Stazioni Ferroviarie',
    url: 'http://www.insidemilan.it/layers/getTrainStation'
  },
   {
    name: 'Ferrovie',
    url: 'http://www.insidemilan.it/layers/getRails'
  },
   **/
  {
    name: 'Linee metropolitana',
    url: 'http://www.insidemilan.it/layers/getMetroLines'
  },
  {
    name: 'Ferrovie',
    url: 'http://www.insidemilan.it/layers/getRails'
  }
  /*,
  {
    name: 'Stazioni metropolitana',
    url: 'http://www.insidemilan.it/layers/getMetroStations'
  },
  {
    name: 'Aree cani',
    url: 'http://www.insidemilan.it/layers/getDogZone'
  },
  {
    name: 'Parchi',
    url: 'http://www.insidemilan.it/layers/getParks'
  },
  {
    name: 'Piste Ciclabili',
    url: 'http://www.insidemilan.it/layers/getBikePaths'
  }*/
]
