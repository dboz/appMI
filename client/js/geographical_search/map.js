function GeneralMap() {
  this.test = test;
  this.div = undefined;
  this.map = undefined;
  this.controls = undefined;

  this.polyOptions = undefined;
  this.inspireLayersList = [];

  this.queryBoundingBox = {
    q: "",
    fq: ""
  };

  this.createMap = createMap;
  this.createMarkerIcon = createMarkerIcon;
  this.createSearchBboxLayer = createSearchBboxLayer;
  this.createBBoxQuery = createBBoxQuery;

  this.markers = undefined;
  this.markerIcon = undefined;

  this.addDiv = addDiv;
  this.addControls = addControls;
  this.addMarker = addMarker;
  this.addControl = addControl;
  this.addBasemap = addBasemap;
  this.addLayers = addLayers;
  this.addInspireLayer = addInspireLayer;
  this.addLayer = addLayer;
  this.addDragPopup = addDragPopup;
  this.addImage = addImage;

  this.setProjection = setProjection;
  this.setMaxExtent = setMaxExtent;
  this.setUnits = setUnits;
  this.setResolutions = setResolutions;
  this.setNumZoomLevels = setNumZoomLevels;
  this.setTileSize = setTileSize;
  this.setRestrictedExtent = setRestrictedExtent;
  this.setCenterWithZoom = setCenterWithZoom;
  this.setDefaultCenter = setDefaultCenter;
  this.setDefaultCenterWithZoom = setDefaultCenterWithZoom;
  this.setOpacity = setOpacity;
  this.setMaxResolution = setMaxResolution;
  this.setMinResolution = setMinResolution;

  this.showBoundingBox = showBoundingBox;
  this.disableZoomWheel = disableZoomWheel;
  this.searchBboxLayer = undefined;
  this.buildBBoxQuery = buildBBoxQuery;
  this.updateBboxCriteria = updateBboxCriteria;
  this.removeBboxQuery = removeBboxQuery;

  this.getLoadedLayersSize = getLoadedLayersSize;
  this.getProjCode = getProjCode;
  this.getNumberInspireLayers = getNumberInspireLayers;
  this.getAllBasemap = getAllBasemap;
  this.getLayerIndex = getLayerIndex;
  this.getAllLayersWithoutBasemaps = getAllLayersWithoutBasemaps;

  this.moveLayer = moveLayer;

  this.zoomToExtent = zoomToExtent;
  this.showInspireLayer = showInspireLayer;
  this.isLoadedLayer = isLoadedLayer;
  this.chooseCRS = chooseCRS;
  this.hideInspireLayer = hideInspireLayer;
  this.removeInspireLayer = removeInspireLayer;
  this.removeAllBboxLayerVector = removeAllBboxLayerVector;
  this.removeLayer = removeLayer;
  this.presenceOfInspireLayer = presenceOfInspireLayer;
  this.removeAllInspireLayer = removeAllInspireLayer;
  this.removeControl = removeControl;

  this.exitFullScreen = exitFullScreen;

  function addInspireLayer(layer) {
    var layers = this.inspireLayersList;
    var check = true;
    $.each(layers, function(index, inspireLayer) {
      if (inspireLayer.url === layer.url)
        check = false;
    });
    if (check) {
      this.inspireLayersList.push(layer);
      return true;
    } else {
      return false;
    }
  }

  function addLayer(layer) {
    this.map.addLayer(layer);
  }

  function hideInspireLayer(layer) {
    var layers = this.inspireLayersList;
    for (var index = 0; index < layers.length; index++) {
      if (layers[index].id === layer.id) {
        if (this.map != undefined) {
          var currentLayerList = this.map.layers;
          for (var i = 0; i < currentLayerList.length; i++) {
            if (currentLayerList[i].url == layers[index].serviceUrl
                    && currentLayerList[i].name == layers[index].layerTitle) {
              this.map.removeLayer(currentLayerList[i]);
            }
          }
        }
      }
    }
  }

  function getNumberInspireLayers() {
    return this.inspireLayersList.length;
  }

  function removeLayer(layer) {
    return this.map.removeLayer(layer);
  }

  function removeAllBboxLayerVector() {
    for (var i = 0; i < this.map.layers.length; i++) {
      var layer = this.map.layers[i];
      if (layer.name === "BBOX")
        this.map.removeLayer(layer);
    }
  }

  function removeInspireLayer(id) {
    var layers = this.inspireLayersList;
    for (var index = 0; index < layers.length; index++) {
      if (layers[index].id === id) {
        if (this.map != undefined) {
          var currentLayerList = this.map.layers;
          for (var i = 0; i < currentLayerList.length; i++) {
            if (currentLayerList[i].url == layers[index].serviceUrl
                    && currentLayerList[i].name == layers[index].layerTitle) {
              this.map.removeLayer(currentLayerList[i]);
            }
          }
        }
        layers.splice(index, 1);
      }
    }
    this.inspireLayersList = layers;
  }


  function presenceOfInspireLayer(url_id) {
    var layers = this.inspireLayersList;
    for (var index = 0; index < layers.length; index++)
      if (layers[index].original_layer_document_url === url_id)
        return layers[index].id;
    return undefined;
  }

  function removeAllInspireLayer() {
    for (var j = this.map.layers.length - 1; j > -1; j--) {
      this.map.removeLayer(this.map.layers[j]);
    }

  }

  function setOpacity(id, opacity) {
    var layers = this.inspireLayersList;
    for (var index = 0; index < layers.length; index++) {
      if (layers[index].id === id) {
        if (this.map != undefined) {
          layers[index].opacity = opacity;
          var currentLayerList = this.map.layers;
          for (var i = 0; i < currentLayerList.length; i++) {
            if (currentLayerList[i].url == layers[index].serviceUrl && currentLayerList[i].name == layers[index].layerTitle) {
              currentLayerList[i].setOpacity(opacity);
            }
          }
        }
      }
    }
  }

  function addDragPopup(id, layer) {
    if (layer.legends.length > 0 && layer.legend_displayed == false) {

      layer.legend_displayed = true;
      var $id = "#" + id;
      var popup = new OpenLayers.Popup(id + "_popup",
              mapViewer.map.getCenter(),
              new OpenLayers.Size({
        w: 200,
        h: 300
      }),
      '<div id="' + id + '"></div>',
              null,
              false
              );
      popup.autoSize = true;
      //popup.minSize = new OpenLayers.Size({w:200,h:30});
      popup.updateSize();
      $(popup.groupDiv).css('border', '1px solid silver');
      mapViewer.map.addPopup(popup);
      var dragPopup = new OpenLayers.Control.DragPopup(popup);
      mapViewer.map.addControl(dragPopup);

      var $close_button = $('<button></button>');
      $close_button.button({
        label: 'Close',
        icons: {
          primary: 'ui-icon-squaresmall-close'
        },
        text: false
      }).css('width', '18px').css('height', '18px');
      $close_button.click(function() {
        dragPopup.destroy();
        popup.destroy();
        layer.legend_displayed = false;
      });

      var $minimize_button = $('<button></button>');
      $minimize_button.button({
        label: 'Minimize',
        icons: {
          primary: 'ui-icon-squaresmall-minus'
        },
        text: false
      }).css('width', '18px').css('height', '18px');
      $minimize_button.click(function() {
        $('#' + id + "_popup").animate({
          height: "29px"
        }, 200);
      });

      var $restore_button = $('<button></button>');
      $restore_button.button({
        label: 'Restore',
        icons: {
          primary: 'ui-icon-squaresmall-plus'
        },
        text: false
      }).css('width', '18px').css('height', '18px');
      $restore_button.click(function() {
        popup.updateSize();
        /*$('#' + id + "_popup").animate({
         height: "300px"
         }, 200 );*/
      });
      $('#' + id + "_popup").css('cursor', 'move');
      var $menu = $('<div></div>');
      $menu.css('text-align', 'right').css('height', '30px');
      $($id).append($menu);
      $($menu).append($minimize_button);
      $($menu).append($restore_button);
      $($menu).append($close_button);

      for (var j = 0; j < layer.legends.length; j++) {
        var legend = layer.legends[j];
        var img = new Image();
        $($id).append(img);
        $(img).load(function() {
          popup.updateSize();
          $(this).fadeIn();
        }).error(function() {
          //error
        }).attr('src', legend.legendUrl);
      }

      popup.updateSize();

    }
  }


  function addImage(layer) {
    var content = '';
    content += '<div id="popup_' + layer.id + '">';
    if (layer.legends.length > 0 && layer.legend_displayed == false) {
      layer.legend_displayed = true;

      for (var j = 0; j < layer.legends.length; j++) {
        var legend = layer.legends[j];
        content += '<div id="tabs-' + j + '"><p>' + legend.name + '</p><img src="' + layer.legends[j].legendUrl + '"></img></div>'
      }
      content += '</div>';

      var popup = new OpenLayers.Popup.FramedCloud(
              'popup_' + layer.id,
              layer.boundingbox.getCenterLonLat(),
              new OpenLayers.Size(250, 400),
              content,
              null,
              true,
              function() {
                popup.destroy();
                layer.legend_displayed = false;
              }
      );
      popup.updateSize();
      this.map.addPopup(popup);
    }
  }


  function addDiv(divID) {
    if ($('#' + divID) === undefined) {
      this.div = undefined;
      return false;
    }
    else {
      this.div = divID;
      return true;
    }
  }

  function addControls(controls) {
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

  function createMap() {
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
  }

  function addControl(control) {
    this.map.addControl(control);
  }

  function createMarkerIcon() {
    if (this.markIcon === undefined) {
      var size = new OpenLayers.Size(21, 25);
      var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
      this.markerIcon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker-blue.png', size, offset);
      this.markerIcon.setOpacity(0.7);
    }
    return this.markerIcon.clone();
  }



  function addMarker(lat, lon, zoom, name) {
    var coordinate = new OpenLayers.LonLat(lon, lat);
    this.map.setCenter(coordinate, zoom);
    if (this.markers === undefined) {
      this.markers = new OpenLayers.Layer.Markers('Markers');
      this.map.addLayer(this.markers);
    }

    var icon = this.createMarkerIcon();
    var marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat), icon);
    var remove_marker = $('<a href=geosearch >Remove Marker</a>');
    var id = 'remove_marker_' + this.map.popups.length;
    remove_marker.attr('id', id);

    var popup = new OpenLayers.Popup.FramedCloud(
            'popup_' + this.map.popups.length,
            coordinate,
            new OpenLayers.Size(100, 100),
            '<p>' + name + '<br/> LAT: ' + lat + ', LON: ' + lon + '</p>' + remove_marker[0].outerHTML,
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
    alert('The place has been marked on the map, but you have to draw the bounding box manually.')
  }

  function setProjection(projection) {
    this.map.setOptions({
      projection: projection
    })
  }

  function setRestrictedExtent(restrictedExtent) {
    this.map.setOptions({
      RestrictedExtent: restrictedExtent
    })
  }

  function setMaxExtent(maxExtent) {
    this.map.setOptions({
      maxExtent: maxExtent
    })
  }

  function setUnits(units) {
    this.map.setOptions({
      units: units
    })
  }

  function setResolutions(resolutions) {
    this.map.setOptions({
      resolutions: resolutions
    })
  }

  function setNumZoomLevels(numZoomLevels) {
    this.map.setOptions({
      numZoomLevels: numZoomLevels
    })
  }

  function setTileSize(tileSize) {
    this.map.setOptions({
      tileSize: tileSize
    });
  }

  function setMaxResolution(maxResolution) {
    this.map.setOptions({
      maxResolution: maxResolution
    });
  }

  function setMinResolution(minResolution) {
    this.map.setOptions({
      minResolution: minResolution
    });
  }

  function addBasemap(basemap) {
    this.map.addLayer(basemap);
  }

  function addLayers(layer) {
    this.map.addLayers(layer);
  }

  function getProjCode() {
    var code = this.map.getProjectionObject();
    return code.projCode;
  }

  function addVectorLayer(layer) {
    this.map.addLayer(layer);
  }

  function getLoadedLayersSize() {
    // var layers = this.map.layer;
    var size = this.map.getNumLayers();
    var layer = undefined;
    for (var i = 0; i < size; i++) {
      // console.log(layers[i]);
    }
    return size;
  }

  function setCenterWithZoom(lon, lat, zoom) {
    var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0);
    this.map.zoomToExtent(bounds);
    this.map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
  }

  function setDefaultCenter() {
    var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0);
    this.map.zoomToExtent(bounds);
    this.map.setCenter(new OpenLayers.LonLat(10, 48), 3);
  }

  function setDefaultCenterWithZoom(zoom_level) {
    var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0);
    this.map.zoomToExtent(bounds);
    this.map.setCenter(new OpenLayers.LonLat(10, 48), zoom_level);
  }

  function zoomToExtent(bounds) {
    this.map.zoomToExtent(bounds);
  }

  function disableZoomWheel() {
    var controls = this.map.getControlsByClass('OpenLayers.Control.Navigation');
    for (var i = 0; i < controls.length; ++i)
      controls[i].disableZoomWheel();
    return true;
  }
  /*
   *An array that rapresent a bbox => [West,South,East,North]
   */
  function showBoundingBox(bbox) {
    var bboxwest = bbox[0];
    var bboxsouth = bbox[1];
    var bboxeast = bbox[2];
    var bboxnorth = bbox[3];
    var bounds = new OpenLayers.Bounds();
    bounds.extend(new OpenLayers.LonLat(bboxwest, bboxsouth));
    bounds.extend(new OpenLayers.LonLat(bboxeast, bboxnorth));

    var fillColor = 'red';

    var defaultBboxStyle = new OpenLayers.Style({
      fillColor: fillColor,
      fillOpacity: 0.001,
      strokeColor: "red",
      strokeWidth: 2
    });

    var selectBboxStyle = new OpenLayers.Style({
      fillColor: fillColor,
      fillOpacity: 0.001,
      strokeColor: "blue",
      strokeWidth: 2
    });

    var styleMap = new OpenLayers.StyleMap({
      'default': defaultBboxStyle,
      'select': selectBboxStyle
    });

    var options = {
      displayInLayerSwitcher: false,
      styleMap: styleMap,
      rendererOptions: {
        zIndexing: true
      }
    };

    var resultBboxLayer = new OpenLayers.Layer.Vector("BBOX", options);
    this.map.addLayer(resultBboxLayer);
    var control_nav_history = new OpenLayers.Control.NavigationHistory();
    this.map.addControl(control_nav_history);
    var box = new OpenLayers.Feature.Vector(bounds.toGeometry());
    resultBboxLayer.addFeatures(box);
    //this.map.zoomToExtent(bounds); auto zoom
  }

  function createSearchBboxLayer() {
    this.searchBboxLayer = new OpenLayers.Layer.Vector("Search Bounding Box Layer");
    this.map.addLayer(this.searchBboxLayer);
    var control_nav_history = new OpenLayers.Control.NavigationHistory();
    this.map.addControl(control_nav_history);
    this.polyOptions = {
      sides: 4,
      irregular: true
    };

    var controls = {
      pan: new OpenLayers.Control.Navigation({
        title: "Drag map"
      }),
      polygon: new OpenLayers.Control.DrawFeature(this.searchBboxLayer, OpenLayers.Handler.RegularPolygon, {
        searchBboxLayer: this.searchBboxLayer,
        handlerOptions: this.polyOptions,
        title: "Draw bounding box: when this option is selected and the mouse button is held down, the arrow cursor will draw a bounding box on the map."
                /* for single bbox */
                ,
        featureAdded: function(feature) {
          this.searchBboxLayer.removeAllFeatures();
          this.searchBboxLayer.addFeatures(feature, this.handlerOptions);
        }
      }),
      drag: new OpenLayers.Control.DragFeature(this.searchBboxLayer, {
        self: this,
        onComplete: function() {
          this.self.updateBboxCriteria();
          this.createBBoxQuery();
          this.buildBBoxQuery();
        },
        onDrag: function() {
        },
        title: "Move bounding box: when this option is selected and the mouse button is held down on a bounding box, the arrow cursor will move the bounding box on the map."

      }),
      remove: new OpenLayers.Control.SelectFeature(this.searchBboxLayer, {
        self: this,
        onSelect: function() {
          this.layer.removeAllFeatures();
          this.self.updateBboxCriteria();
          this.createBBoxQuery();
          this.buildBBoxQuery();
        },
        title: "Delete bounding box: when this option is selected, clicking on a bounding box on the map will remove it."
      }),
      modify: new OpenLayers.Control.ModifyFeature(this.searchBboxLayer, {
        mode: OpenLayers.Control.ModifyFeature.RESIZE,
        title: "Resize bounding box: when this option is selected, a bounding box on the map can be selected. Then, clicking the handle placed at the bottom right corner of the box and keeping the mouse button held down, the arrow cursor will resize the bounding box."
      })/*,
       point : new OpenLayers.Control.DrawFeature(this.searchBboxLayer, OpenLayers.Handler.Point,{
       'displayClass': 'olControlDrawFeaturePoint',
       featureAdded :function(){
       
       }
       })*/

    };

    this.updateBboxCriteria();

    var panel = new OpenLayers.Control.Panel({
      defaultControl: controls.pan
    });
    //panel.addControls([controls.pan,controls.polygon,controls.drag,controls.modify,controls.remove, controls.point]);
    panel.addControls([controls.pan, controls.polygon, controls.drag, controls.modify, controls.remove]);
    this.map.addControl(panel);

    this.searchBboxLayer.events.register('featureadded', this, function() {
      this.updateBboxCriteria();
      this.createBBoxQuery();
      this.buildBBoxQuery();

    });

    this.searchBboxLayer.events.register('featuremodified', this, function() {
      this.updateBboxCriteria();
      this.createBBoxQuery();
      this.removeBboxQuery();
      this.buildBBoxQuery();
    });



    //var bounds = new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0); 
    //this.map.zoomToExtent(bounds);            
    //this.map.setCenter(new OpenLayers.LonLat(10, 48), 3);

  }

  function updateBboxCriteria() {
    if (this.searchBboxLayer.features.length > 0) {
      var html = $('<a>Remove all restrictions <span class="icon_delete">&times;</span></a>');
      html.click({
        self: this
      }, function(event) {
        event.data.self.removeBboxQuery();
      });
      $('#bbox-criteria').html(html);
    } else {
      $('#bbox-criteria').html('<p>None applied.</p>');
    }
  }

  function removeBboxQuery() {
    if (this.searchBboxLayer.features.length > 0) {
      this.searchBboxLayer.features[0].layer.removeAllFeatures();
      this.updateBboxCriteria();
      Manager.store.removeByValue('fq', this.queryBoundingBox.fq);
      Manager.doRequest(0);
      //var bboxQuery = this.createBBoxQuery();
      //this.buildBBoxQuery(bboxQuery);
    }
  }

  function createBBoxQuery() {
    //Manager.store.remove('q');
    //console.log(this.queryBoundingBox.fq);
    //Manager.store.removeByValue('fq', this.queryBoundingBox.fq);

    qtype = 'bbox';
    if (this.searchBboxLayer) {

      // for (var key=0; key < this.searchBboxLayer.features.length;key++){
      //if (query.length > 0){
      //  query = query.concat(' OR ')
      //}
      var bounds = this.searchBboxLayer.features[0].geometry.bounds;
      this.queryBoundingBox.q = "*:*"
      var filter_query = 'geobox:"Intersects(qGeoboxW qGeoboxS qGeoboxE qGeoboxN)"';
      filter_query = filter_query.replace("qGeoboxW", bounds.left, "g").replace("qGeoboxE", bounds.right, "g").replace("qGeoboxN", bounds.top, "g").replace("qGeoboxS", bounds.bottom, "g");
      this.queryBoundingBox.fq = filter_query;
      //var q = "*:* -(geoboxE:{* TO qGeoboxW} OR  geoboxW:{qGeoboxE TO *} OR  geoboxS:{qGeoboxN TO *} OR  geoboxN:{* TO qGeoboxS}) ";
      //var q = "(*:* -(geoboxE:{* TO qGeoboxW}OR  geoboxW:{qGeoboxE TO *} OR  geoboxS:{qGeoboxN TO *} OR  geoboxN:{* TO qGeoboxS})) ";
      //var q = "*:* ( geoboxE:{qGeoboxE TO qGeoboxW} OR geoboxW:{qGeoboxW TO qGeoboxE} ) AND ( geoboxS:{qGeoboxS TO qGeoboxN} OR geoboxN:{qGeoboxN TO qGeoboxS} )";
      //q = q.replace("qGeoboxW", bounds.left,"g").replace("qGeoboxE", bounds.right,"g").replace("qGeoboxN", bounds.top,"g").replace("qGeoboxS", bounds.bottom,"g");

      //var workaround = "";
      //if (key > 0 || this.searchBboxLayer.features == 1){
      //  workaround = "*:*";
      // }
      //q = q.replace("workaround", workaround);
      //query = query.concat(q);
      //var globalRank = rankFunction().replace('*:*',' ');
      //query = query.concat(globalRank);

      //var rankFunct = "AND (_val_:\"map(geoboxN,qGeoboxS,qGeoboxN,100, 0)\""; // & _val_:\"map(geoboxS,qGeoboxS,qGeoboxN,100)\" _val_:\"map(geoboxE,qGeoboxE,qGeoboxW,100)\" _val_:\"map(geoboxW,qGeoboxE,qGeoboxW,100)\"";
      //rankFunct = rankFunct.concat("AND _val_:\"map(geoboxS,qGeoboxS,qGeoboxN,100, 0)\"");
      //rankFunct = rankFunct.replace("qGeoboxW", bounds.left,"g").replace("qGeoboxE", bounds.right,"g").replace("qGeoboxN", bounds.top,"g").replace("qGeoboxS", bounds.bottom,"g");

      //rankFunct = rankFunct.concat("AND _val_:\"map(geoboxE,qGeoboxW,qGeoboxE,100, 0)\"");
      //rankFunct = rankFunct.replace("qGeoboxW", bounds.left,"g").replace("qGeoboxE", bounds.right,"g").replace("qGeoboxN", bounds.top,"g").replace("qGeoboxS", bounds.bottom,"g");

      //rankFunct = rankFunct.concat("AND _val_:\"map(geoboxW,qGeoboxW,qGeoboxE,100, 0)\")");
      //rankFunct = rankFunct.replace("qGeoboxW", bounds.left,"g").replace("qGeoboxE", bounds.right,"g").replace("qGeoboxN", bounds.top,"g").replace("qGeoboxS", bounds.bottom,"g");
      //query = query.concat(rankFunct);
      BBOX = true;
      //   }
    }
    //if (query.length === 0){
    //  qtype = null;
    //  query = rankFunction();
    //  BBOX = false;
    //}

    //return query;
  }

  function buildBBoxQuery() {
    //Manager is an object of the ajax-solr istance
    this.map.updateSize();
    Manager.store.addByValue('q', this.queryBoundingBox.q);
    Manager.store.addByValue('fq', this.queryBoundingBox.fq);
    Manager.doRequest(0);
  }

  function getAllBasemap() {
    var layers = this.map.layers;
    var baseLayers = [];
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].isBaseLayer)
        baseLayers.push(layers[i]);
    }
    return baseLayers;
  }



  function showInspireLayer(layer) {

    //var id = mapViewer.getLayers().length+1;
    // do nothing if layer has already been loaded 
    if (!this.isLoadedLayer(layer)) {

      //TODO: update this function chooseCRS() to support WMTS. Otherwise force to use one CRS.         
      var crs = this.chooseCRS(layer);

      // do nothing if we can't choose crs 
      if (crs != null) { ///<<<<<<------------
        var wms;

        if (layer.serviceType == 'WMS111') {
          wms = new OpenLayers.Layer.WMS(layer.layerTitle, layer.serviceUrl,
                  {
                    id: layer.id,
                    layers: layer.layerName,
                    version: "1.1.1",
                    srs: crs,
                    service: "WMS",
                    request: "GetMap",
                    styles: "",
                    format: "image/png",
                    exceptions: "application/vnd.ogc.se_xml",
                    transparent: true
                  }, {
            isBaseLayer: false
          });
        }

        // 1.3.0
        else if (layer.serviceType == 'WMS130') {

          wms = new OpenLayers.Layer.WMS(layer.layerTitle, layer.serviceUrl,
                  {
                    id: layer.id,
                    layers: layer.layerName,
                    version: "1.3.0",
                    projection: crs,
                    crs: crs,
                    service: "WMS",
                    request: "GetMap",
                    styles: "",
                    format: "image/png",
                    exceptions: "XML",
                    srsKey: "CRS",
                    transparent: "TRUE"
                  }, {
            yx: {
              'EPSG:4326': true,
              'EPSG:4258': true
            },
            isBaseLayer: false
          });
        }

        // WMTS
        else if (layer.serviceType == 'WMTS') {

          // choose tile matrix set
          var tileMatrixSet;
          if (crs == "EPSG:4326") {
            setBaseNormalWMS4326();    // check if neccessary or not 
            tileMatrixSet = getTileMatrixSet4326(layer.tileMatrixSets);
          }
          else if (crs == "EPSG:4258") {
            setBaseNormalWMS4258();   // check if neccessary or not 
            tileMatrixSet = getTileMatrixSet4258(layer.tileMatrixSets);
          }
          wms = new OpenLayers.Layer.WMTS({
            name: layer.layerTitle,
            url: layer.serviceUrl,
            layer: layer.layerName,
            matrixSet: tileMatrixSet.tileMatrixSetID,
            matrixIds: tileMatrixSet.matrixIds,
            format: "image/png",
            style: "",
            isBaseLayer: false,
            isTransparent: true,
            numZoomLevels: tileMatrixSet.matrixIds.length
          });
        }


        try {
          this.addLayer(wms);
          layer.addOLLayer(wms);
          //console.log(mapViewer);
          //wmsLayers.push(layer); 
          //     checkLayer(wms, layer);     //<<<<.......       >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
          //showWMSLayerList();          
        }
        catch (err) {
          alert("Cannot add layer: " + err.message);
        }

        //this.zoomToExtent(layer.boundingbox);  ///<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        //move user bbox to top 
        //map.setLayerIndex(searchBboxLayer, map.getNumLayers()-1);
      }

    }

  }

  function getLayerIndex(ol_layer) {
    if (ol_layer === undefined)
      return -1;
    else
      return this.map.getLayerIndex(ol_layer);
  }
  ;

  function getAllLayersWithoutBasemaps() {
    var layers = [];
    for (var i = 0; i < this.map.layers.length; i++) {
      if (this.map.layers[i].isBaseLayer == false)
        layers.push(this.map.layers[i]);
    }
    return layers;
  }

  function test() {

  }

  function moveLayer(inspire_layer, delta) {
    if (inspire_layer.OLLayer != undefined) {
      this.map.raiseLayer(inspire_layer.OLLayer, delta);
      return true;
    }
    return false;
  }



  // The layer name in OpenLayer is the layer title in OGC standard
  // parameter: an INSPIRELayer
  function isLoadedLayer(layer) {
    var result = false;
    if (this.map === undefined) {
      return result;
    }
    if (layer.serviceType == "WMTS") {
      result = false;
    }
    else if (layer.serviceType == "WMS111" || layer.serviceType == "WMS130") {
      var currentLayerList = this.map.layers;
      for (var i = 0; i < currentLayerList.length; i++) {
        if (currentLayerList[i].url == layer.serviceUrl && currentLayerList[i].name == layer.layerTitle) {

          return true;
        }
      }
    }
    return result;
  }

  //  choose CRS for a layer
  // parameter: an INSPIRELayer
  // steps: 
  // 1: if current CRS of map supports the layer, just add it to the map then finish. Otherwise go to step 2.  
  // 2: if CRS list of layer doesn't have any common with supported CRS list then it can't be added, finish here. Otherwise go to step 3.
  // 3: check if this layer and current active layers has any common CRS 
  // if yes then choose that CRS (priority choosing if there are many)
  // 4: if not, choose a CRS inside the CRS list of this layer (priority choosing) 
  // then remove every active layers which doesn't support this CRS. Need user confirmation.  
  function chooseCRS(layer) {
    //(serviceType, serviceUrl, layerTitle, layerName, CRSList, boundingbox)
    var crs = null;
    //CRS of the current map base layer
    var mapCRS;

    mapCRS = this.getProjCode();

    // Step 1. Check map CRS is inside CRS List          

    if (layer.CRSList.includes(mapCRS)) {
      crs = mapCRS;

    }

    else {

      //Step 2. if CRS list of layer doesn't have any common with supported CRS list then it can't be added 

      var supportedCRSListOfLayer = supportedCRSs.overlaps(layer.CRSList);

      if (supportedCRSListOfLayer == null) {
        //alert('error: the layer is not available in any supported CRSs: ' + supportedCRSs);   <<<<<<<<<<<<<<<<<<<<
      }
      else {
        // Step 3. now we know the layer CRSs are supported at least one. Check if they have 
        // common CRS with current active layers or not

        // copy the array, we might need the old instance for later use  
        var supportedCommonCRSList = supportedCRSListOfLayer.slice(0);
        for (var idx = 0; idx < wmsLayers.length; idx++) {
          if (supportedCommonCRSList != null)
            supportedCommonCRSList = supportedCommonCRSList.overlaps(wmsLayers[idx].CRSList);
        }
        if (supportedCommonCRSList == null) {
          // Step 4. No common CRS. Choose from CRS List of chosen layer. 
          var userConfirmation = confirm('The chosen layer has no common CRS with current active layers. ' +
                  'You can try to remove one or more active layers then add this layer again. ' +
                  'Do you want geoportal to do it automatically for you?');
          if (userConfirmation) {
            crs = supportedCRSListOfLayer[0];
            // find the layers in active list which supports this crs
            wmsReAddLayers.length = 0;
            for (var i = 0; i < wmsLayers.length; i++) {
              if (wmsLayers[i].CRSList.includes(crs)) {
                wmsReAddLayers.push(wmsLayers[i]);
              }
            }
          }
          else  // user does not agree, do nothing 
            crs = null;
        }
        else {  // we have at least one common CRS in our supported list                  
          crs = supportedCommonCRSList[0];
          if (wmsLayers.length > 0) {
            //alert('The chosen layer does not support current CRS in the map. ' + 
            // 'The map is going to switch to a common CRS of the layers.');
            wmsReAddLayers.length = 0;
            for (var j = 0; j < wmsLayers.length; j++) {
              wmsReAddLayers.push(wmsLayers[j]);
            }
          }
        }
      }
    }
    //alert('selectedCRS: ' + crs);
    return crs;
  }

  function removeControl(className) {
    var attribution = this.map.getControlsByClass(className);
    if (attribution !== undefined && attribution.length > 0) {
      for (var i = 0; i < attribution.length; i++)
        this.map.removeControl(attribution[i]);
    }
  }
  /*
   * options:
   * layer_id for the metadata presentation layout
   */
  function exitFullScreen(layout, options) {
    var controls = this.map.getControlsByClass('OpenLayers.Control.FullScreen');
    if (controls.length > 0) {
      var fullScreen = controls[0];
      fullScreen.deactivate(layout, options);
      return true;
    } else
      return false;

  }

}