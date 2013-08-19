/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires jquery 1.5++
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */

OpenLayers.Control.ProgressBar = OpenLayers.Class(OpenLayers.Control, {
    
  initialize: function(options) {
    OpenLayers.Control.prototype.initialize.apply(this, [options]);
  },
    
  /**
     * Set {DOM} element
     *
     */
  setDiv : function(id){
    var element = document.getElementById(id);
    if(element)
      this.div = element;
  },
    
  /**
     * Method: addLayer
     * Attach event handlers when new layer gets added to the map
     *
     * Parameters:
     * evt - {Event}
     */
  addLayer: function(evt) {
    if (evt.layer) {
      evt.layer.events.register('loadstart', {
        layer:evt.layer,
        self:this
      }, this.tilesCheck);
    }
  },
    
  /**
     * Method: setMap
     * Set the map property for the control and all handlers.
     *
     * Parameters: 
     * map - {<OpenLayers.Map>} The control's map.
     */
  setMap: function(map) {
    OpenLayers.Control.prototype.setMap.apply(this, arguments);
    this.map.events.register('preaddlayer', this, this.addLayer);
  },
  
  /**
     * Method: tilesCheck
     * Check all tiles belongs to layer
     *
     */  
  tilesCheck: function() {
    var self = this.self;
    var grid = this.layer.grid;
    self.totalTiles = 0;
    self.progressBarValue = 0;
    for(var i=0;i<grid.length;i++){
      for(var j=0;j<grid[i].length;j++){
        var tile = grid[i][j];
               
        if(tile.progressBarObserver == undefined){
          tile.events.register('loadstart', {
            self:self
          }, function(){
            self.totalTiles++;
          });
          tile.events.register('loadend', {
            self:self
          }, self.setProgressBar);
        }
        tile.progressBarObserver = true;
      }
    }
  },
    
  progressBarValue: 0,
  totalTiles: 0,
    
  setProgressBar: function(){
                
    var self = this.self;
    self.progressBarValue++;
    
    var value = self.totalTiles == 0 ? 0 : Math.round((self.progressBarValue * 100 / self.totalTiles));
    value = value > 100 ? 100 : value; //first loading
    var $progress_bar_content = $('#progress-bar-content');
    $progress_bar_content.empty();
    var $progress_bar =  $('<div></div>').progressbar({
      value: value
    }).css('height','20px');
    var $progress_bar_value = $('<div id="progress-bar-value">' + value + '%</div>');
    $progress_bar_content.append($progress_bar);
    $progress_bar_content.append($progress_bar_value);
    self.div.innerHTML = $progress_bar_content[0].innerHTML;
  
  },
    
  /**
     * Method: draw
     * Create and return the element to be splashed over the map.
     */
  draw: function () {
    OpenLayers.Control.prototype.draw.apply(this, arguments);
    return this.div;
  },

  /** 
     * Method: destroy
     * Destroy control.
     */
  destroy: function() {
    if (this.map) {
      this.map.events.unregister('preaddlayer', this, this.addLayer);
      if (this.map.layers) {
        for (var i = 0; i < this.map.layers.length; i++) {
          var layer = this.map.layers[i];
          layer.events.unregister('loadstart', this, 
            this.increaseCounter);
          layer.events.unregister('loadend', this, 
            this.decreaseCounter);
        }
      }
    }
    OpenLayers.Control.prototype.destroy.apply(this, arguments);
  },     

  CLASS_NAME: "OpenLayers.Control.ProgressBar"

});
