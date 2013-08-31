function MapOL() {
  
  this.div = undefined;
  this.map = undefined;
  this.controls = undefined;


  this.addLayer = function (layer) {
    this.map.addLayer(layer);
  }

  
  this.removeLayer = function(layer) {
    return this.map.removeLayer(layer);
  }
  
  
  this.addDiv = function(divID) {
    if ($('#' + divID) === undefined) {
      this.div = undefined;
      return false;
    }
    else {
      this.div = divID;
      return true;
    }
  }

  this.addControls = function (controls) {
    if (controls === undefined) {
      this.controls = undefined;
      return false;
    } else {
      this.controls = controls;
      if (this.map !== undefined)
        this.map.addControls(controls);
      return true;
    }
  }

  this.createMap = function () {
    if (this.div === undefined) {
      this.map = undefined;
      return false;
    }
    if (this.div !== undefined && this.controls !== undefined) {
      this.map = new OpenLayers.Map(this.div, {
        controls: this.controls
      });
      return true;
    }
    if (this.div !== undefined && this.controls === undefined) {
      this.map = new OpenLayers.Map({div: this.div, controls: []});
      return true;
    }
    return false;
  };

  this.addControl = function(control) {
    this.map.addControl(control);
  };

  this.createMarkerIcon = function() {
    if (this.markIcon === undefined) {
      var size = new OpenLayers.Size(21, 25);
      var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
      this.markerIcon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker-blue.png', size, offset);
      this.markerIcon.setOpacity(0.7);
    }
    return this.markerIcon.clone();
  };



  this.addMarker = function(coordinate, zoom, content) {
    //var coordinate = new OpenLayers.LonLat(lon, lat);
    this.map.setCenter(coordinate, zoom);
    if (this.markers === undefined) {
      this.markers = new OpenLayers.Layer.Markers('Markers');
      this.map.addLayer(this.markers);
    }

    var icon = this.createMarkerIcon();
    var marker = new OpenLayers.Marker(coordinate, icon);
    var remove_marker = $('<a style="cursor:hand;">Rimuovi marker</a>');
    var id = 'remove_marker_' + this.map.popups.length;
    remove_marker.attr('id', id);

    var popup = new OpenLayers.Popup.FramedCloud(
            'popup_' + this.map.popups.length,
            coordinate,
            new OpenLayers.Size(100, 100),
            content + remove_marker[0].outerHTML,
            null,
            true,
            function() {
              popup.hide();
            });

    this.map.addPopup(popup);
    popup.hide();

    marker.events.register('mouseover', marker, function() {
      this.setOpacity(1);
      popup.show();
      popup.updateSize();
    });
    marker.events.register('mouseout', marker, function() {
      this.setOpacity(0.7);
    });
    this.markers.addMarker(marker);

    $('#' + id).click({
      self: this
    }, function(event) {
      var self = event.data.self;
      popup.destroy();
      self.markers.removeMarker(marker);
    });
    
  };

  this.setProjection = function (projection) {
    this.map.setOptions({
      projection: projection
    });
  };

  this.setRestrictedExtent = function(restrictedExtent) {
    this.map.setOptions({
      RestrictedExtent: restrictedExtent
    });
  };

  this.setMaxExtent = function (maxExtent) {
    this.map.setOptions({
      maxExtent: maxExtent
    });
  };

  this.setUnits = function (units) {
    this.map.setOptions({
      units: units
    });
  };

  this.setResolutions = function (resolutions) {
    this.map.setOptions({
      resolutions: resolutions
    });
  };

  this.setNumZoomLevels = function (numZoomLevels) {
    this.map.setOptions({
      numZoomLevels: numZoomLevels
    })
  }

  this.setTileSize = function (tileSize) {
    this.map.setOptions({
      tileSize: tileSize
    });
  }

  this.setMaxResolution = function (maxResolution) {
    this.map.setOptions({
      maxResolution: maxResolution
    });
  }

  this.setMinResolution = function (minResolution) {
    this.map.setOptions({
      minResolution: minResolution
    });
  }

  this.addBasemap = function (basemap) {
    this.map.addLayer(basemap);
  }

  this.addLayers = function (layer) {
    this.map.addLayers(layer);
  }

  this.getProjCode = function () {
    var code = this.map.getProjectionObject();
    return code.projCode;
  }

  this.addVectorLayer = function addVectorLayer(layer) {
    this.map.addLayer(layer);
  }

  

  this.setCenterWithZoom = function (lon, lat, zoom) {
    var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0);
    this.map.zoomToExtent(bounds);
    this.map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
  }

  this.setDefaultCenter = function () {
    var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0);
    this.map.zoomToExtent(bounds);
    this.map.setCenter(new OpenLayers.LonLat(10, 48), 3);
  }

  this.setDefaultCenterWithZoom = function (zoom_level) {
    var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0);
    this.map.zoomToExtent(bounds);
    this.map.setCenter(new OpenLayers.LonLat(10, 48), zoom_level);
  }

  this.zoomToExtent = function (bounds) {
    this.map.zoomToExtent(bounds);
  }

  this.disableZoomWheel = function () {
    var controls = this.map.getControlsByClass('OpenLayers.Control.Navigation');
    for (var i = 0; i < controls.length; ++i)
      controls[i].disableZoomWheel();
    return true;
  }
 

  this.getAllBasemap = function () {
    var layers = this.map.layers;
    var baseLayers = [];
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].isBaseLayer)
        baseLayers.push(layers[i]);
    }
    return baseLayers;
  };



 
}