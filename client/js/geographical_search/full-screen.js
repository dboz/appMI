/* Copyright (c) 2011-2012 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

OpenLayers.Control.FullScreen = OpenLayers.Class(OpenLayers.Control, {

  type: OpenLayers.Control.TYPE_TOGGLE,

  fullscreenClass: 'fullscreen',
  element : null,
    
  setMap: function(map) {
    OpenLayers.Control.prototype.setMap.apply(this, arguments);
    this.element = document.getElementById('page-content-viewer-map');
    // handle 'Esc' key press
    OpenLayers.Event.observe(document, "fullscreenchange", OpenLayers.Function.bind(function() {
      if (!document.fullscreenEnabled) {
        this.deactivate();
      }
    }, this));
    
  },

  activate: function() {
    if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      }
      //if($.browser.msie){
      //  var wscript = new ActiveXObject("Wscript.shell");
      //  wscript.SendKeys("{F11}");
      //}
      $('.olControlFullScreenItemActive').empty().append($('<button>Back</button>').button());
      OpenLayers.Element.addClass(this.element, this.fullscreenClass);
      OpenLayers.Element.addClass(document.getElementById('map_viewer'), 'map_viewer');
      var olControlAttributionList = document.querySelectorAll('.olControlAttribution');
      for(var i=0;i < olControlAttributionList.length;i++){
        OpenLayers.Element.addClass(olControlAttributionList[i], 'danube-copyright');
      }
      OpenLayers.Element.removeClass(document.getElementById('page-content-viewer-map'), 'page-content-viewer-map');
      OpenLayers.Element.addClass(document.getElementById('map-controls'), 'map-controls');
      OpenLayers.Element.addClass(document.getElementById('double-scale-line'), 'double-scale-line');
      OpenLayers.Element.addClass(document.getElementById('extended-scale'), 'extended-scale');
      OpenLayers.Element.addClass(document.getElementById('mouse-position'), 'mouse-position');
      OpenLayers.Element.addClass(document.getElementById('progress-bar-content'), 'progress-bar-content');
      if(document.getElementById('viewer-layers-list') != undefined){
        OpenLayers.Element.addClass(document.getElementById('viewer-layers-list'), 'viewer-layers-list');
        if($('#loaded-layers-control-button').data('active') == true)
          $('#viewer-layers-list').show();
        else
          $('#viewer-layers-list').hide();
      }
      
      if(document.getElementById('loaded-layers-control') != undefined){
        OpenLayers.Element.addClass(document.getElementById('loaded-layers-control'), 'loaded-layers-control');
      }
      
      $('#map-controls').append($('#viewer-layers-list'));
      $('#banner').hide();
      //$('#map_viewer').append($('#map-controls'));
      this.map.updateSize();
      return true;
    } else {
      return false;
    }
  },

  deactivate: function(layout, options) {
    if(layout === undefined && options === undefined) layout = 'textsearch';
    
    if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      OpenLayers.Element.removeClass(this.element, this.fullscreenClass);
      OpenLayers.Element.removeClass(document.getElementById('map_viewer'), 'map_viewer');
      var olControlAttributionList = document.querySelectorAll('.olControlAttribution');
      for(var i=0;i < olControlAttributionList.length;i++){
        OpenLayers.Element.removeClass(olControlAttributionList[i], 'danube-copyright');
      }
      OpenLayers.Element.addClass(document.getElementById('page-content-viewer-map'), 'page-content-viewer-map');
      OpenLayers.Element.removeClass(document.getElementById('map-controls'), 'map-controls');
      OpenLayers.Element.removeClass(document.getElementById('double-scale-line'), 'double-scale-line');
      OpenLayers.Element.removeClass(document.getElementById('extended-scale'), 'extended-scale');
      OpenLayers.Element.removeClass(document.getElementById('mouse-position'), 'mouse-position');
      OpenLayers.Element.removeClass(document.getElementById('progress-bar-content'), 'progress-bar-content');
      if(document.getElementById('viewer-layers-list') != undefined)
        OpenLayers.Element.removeClass(document.getElementById('viewer-layers-list'), 'viewer-layers-list');
      if(document.getElementById('loaded-layers-control') != undefined){
        OpenLayers.Element.removeClass(document.getElementById('loaded-layers-control'), 'loaded-layers-control');
      }

      $('#viewer-layers-list').show();
      $('#viewer-layers-loaded').append($('#viewer-layers-list'));
      $('#banner').show();
      this.map.updateSize();

      if(conf.enabled_persistent_full_screen){
        if(layout === 'textsearch')
          Routers.goToDiscovery(layout);
        if(layout === 'showmetadata')
          displayMetadata('layer', options.layer_id);
      }
         
      return true;
    } else {
      return false;
    }
  },

  CLASS_NAME: "OpenLayers.Control.FullScreen"
});
