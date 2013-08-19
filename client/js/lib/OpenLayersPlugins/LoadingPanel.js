/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 *
 * Class: OpenLayers.Control.LoadingPanel
 * In some applications, it makes sense to alert the user that something is 
 * happening while tiles are loading. This control displays a div across the 
 * map when this is going on.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);    return r;
};

Array.prototype.inArray = function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == value) return true;
    }
    return false;
}

Array.prototype.index = function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == value) return i;
    }
    return -1;
}

Array.prototype.remove_by_value = function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == value) this.splice(i,1);
    }
    //return this;
}

OpenLayers.Control.LoadingPanel = OpenLayers.Class(OpenLayers.Control, {
    
    
    /**
     * Property: Layers loaded
     * 
     */
    layersList: new Array(),
    /**
     * Property: counter
     * {Integer} A counter for the number of layers loading
     */ 
    counter: 0,
    
    /**
     * Property: notification error
     * {Boolean} A boolean indicating wheter or not the notification is enabled
     */
    notification: true,
    
    /**
     * Property: maximized
     * {Boolean} A boolean indicating whether or not the control is maximized
    */
    maximized: false,

    /**
     * Property: visible
     * {Boolean} A boolean indicating whether or not the control is visible
    */
    visible: true,

    /**
     * Constructor: OpenLayers.Control.LoadingPanel
     * Display a panel across the map that says 'loading'. 
     *
     * Parameters:
     * options - {Object} additional options.
     */
    initialize: function(options) {
         OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    /**
     * Function: setVisible
     * Set the visibility of this control
     *
     * Parameters:
     * visible - {Boolean} should the control be visible or not?
    */
    setVisible: function(visible) {
        this.visible = visible;
        if (visible) {
            OpenLayers.Element.show(this.div);
        } else {
            OpenLayers.Element.hide(this.div);
        }
    },

    /**
     * Function: getVisible
     * Get the visibility of this control
     *
     * Returns:
     * {Boolean} the current visibility of this control
    */
    getVisible: function() {
        return this.visible;
    },

    /**
     * APIMethod: hide
     * Hide the loading panel control
    */
    hide: function() {
        this.setVisible(false);
    },

    /**
     * APIMethod: show
     * Show the loading panel control
    */
    show: function() {
        this.setVisible(true);
    },

    /**
     * APIMethod: toggle
     * Toggle the visibility of the loading panel control
    */
    toggle: function() {
        this.setVisible(!this.getVisible());
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
            if(this.layersList.inArray(evt.layer.name) == false){
                this.layersList.push({
                    name:evt.layer.name,
                    tileErrorLoading:false,
                    message:'',
                    notify:false
                });
            }
            evt.layer.events.register('loadstart', {
                layer:evt.layer,
                self:this
            }, this.tilesCheck);
            evt.layer.events.register('loadstart', {
                layer:evt.layer,
                self:this
            }, this.increaseCounter);
            evt.layer.events.register('loadstart', this, this.checkError);
            evt.layer.events.register('loadend', {
                layer:evt.layer,
                self:this
            }, this.decreaseCounter);
        }
    },
    
    /**
     * Method: removeLayer
     * Attach event handlers when layer removed from the map
     *
     * Parameters:
     * evt - {Event}
    */
    removeLayer: function(evt) {
        if (evt.layer) {
            this.layersList.remove_by_value(evt.layer.name);
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
        this.map.events.register('removelayer', this, this.removeLayer);
        /*for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];
            layer.events.register('loadstart', {layer:layer,self:this}, this.tilesCheck);
            layer.events.register('loadstart', this, this.increaseCounter);
            layer.events.register('loadstart', this, this.checkError);
            layer.events.register('loadend', this, this.decreaseCounter);
        }*/
    },
    
    tilesCheck: function() {
        var self = this.self;
        var layer = this.layer;
        var grid = this.layer.grid
        for(var i=0;i<grid.length;i++){
            for(var j=0;j<grid[i].length;j++){
                var tile = grid[i][j];
                tile.events.register('loaderror', {layer:layer,self:self}, function(){
                    var self = this.self;
                    var layer = this.layer;
                    var index = self.layersList.index(layer.name);
                    if(index > -1){
                        if(layer.isBaseLayer == true){
                            self.layersList[index].message = "Basemap Loading Error";
                        }else{
                            self.layersList[index].message = "Layer Loading Error: " + this.layer.name;
                        }
                    self.layersList[index].tileErrorLoading = true;
                    self.resetCounterByError();
                    }
                });
            }
        }
    },
    
    //checkError: function(evt){
       // window.setTimeout(this.displayError, 1500);
    //},
    
    displayError: function(){
        var self = this;
        for (var i = 0; i < self.layersList.length; i++) {      
            if((self.layersList[i].tileErrorLoading == true)&&(self.layersList[i].notify == false)){
                if(self.notification)
                  alert(self.layersList[i].message);
                self.layersList[i].tileErrorLoading = false;
                self.layersList[i].notify = true;
            }
        }
    },
    
    resetCounterByError: function() {
        if (this.counter > 0) {
            this.counter = 0;
        }
        if (this.counter == 0) {
            if (this.maximized && this.visible) {
                this.minimizeControl();
                this.displayError();
            }
        }
    },
    
    /**
     * Method: increaseCounter
     * Increase the counter and show control
    */
    increaseCounter: function() {
        var self = this.self;
        self.counter++;
        if (self.counter > 0) { 
            if (!self.maximized && self.visible) {
                self.maximizeControl(); 
            }
        }
    },
    
    /**
     * Method: decreaseCounter
     * Decrease the counter and hide the control if finished
    */
    decreaseCounter: function() {
        var self = this.self;
        var layer = this.layer;
        if (self.counter > 0) {
            self.counter--;
        }
        if (self.counter == 0) {
            if (self.maximized && self.visible) {
                self.minimizeControl();
            }
        }
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
     * Method: minimizeControl
     * Set the display properties of the control to make it disappear.
     *
     * Parameters:
     * evt - {Event}
     */
    minimizeControl: function(evt) {
        this.div.style.display = "none"; 
        this.maximized = false;
    
        if (evt != null) {
            OpenLayers.Event.stop(evt);
        }
    },
    
    /**
     * Method: maximizeControl
     * Make the control visible.
     *
     * Parameters:
     * evt - {Event}
     */
    maximizeControl: function(evt) {
        this.div.style.display = "block";
        this.maximized = true;
    
        if (evt != null) {
            OpenLayers.Event.stop(evt);
        }
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

    CLASS_NAME: "OpenLayers.Control.LoadingPanel"

});
