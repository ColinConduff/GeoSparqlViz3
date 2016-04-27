
// global variables 
var map;
var selectControl;
var vectorLayers = [];

// $('.firstItemInactive').html('<span class="glyphicon glyphicon-search"></span>');
// $('.firstItemActive').html('<span class="glyphicon glyphicon-search"></span>');

// $('<button />', {
//   class: 'firstItemInactive',
//   type: 'button',
//   html: '<span class="glyphicon glyphicon-arrow-left"></span>'
// });

// This was used to toggle the size of the map
// See css for Panel1

// var toggleFullScreenMapBtnClicked = false;
// function toggleFullScreenMapBtn() { 
//     if(toggleFullScreenMapBtnClicked == false) {
//         $('.sideBar').hide();
//         $('.mapOuterDiv').removeClass('col-lg-6');
//         map.updateSize();
//         toggleFullScreenMapBtnClicked = true;

//     } else {
//         $('.sideBar').show();
//         $('.mapOuterDiv').addClass('col-lg-6');
//         map.updateSize();
//         toggleFullScreenMapBtnClicked = false;
//     }
// }

function initializeMap() {

    var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
        restrictedExtent = maxExtent.clone();
    
    // var panel = new OpenLayers.Control.Panel({ displayClass: 'Panel1' });
    // panel.addControls([
    //     new OpenLayers.Control.Button({
    //         displayClass: 'first', 
    //         trigger: toggleFullScreenMapBtn, 
    //         title: 'Button is to be clicked'
    //     })
    // ]);

    map = new OpenLayers.Map({
        div: 'map', 
        controls: [
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher()//,
            //panel
        ],
        projection: new OpenLayers.Projection('EPSG:900913'),
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        units: 'm',
        numZoomLevels: 18,
        maxResolution: 156543.0339,
        maxExtent: maxExtent,
        restrictedExtent: restrictedExtent,
        layers: [
            new OpenLayers.Layer.OSM(), // open street map
            new OpenLayers.Layer.XYZ('SmallScale',
                'http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/${z}/${y}/${x}', {
                sphericalMercator: true,
                isBaseLayer: true,
                attribution:'USGS - The National Map'
            }),

            new OpenLayers.Layer.XYZ('NationalMapLarge',
                'http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/${z}/${y}/${x}', {
                sphericalMercator: true,
                isBaseLayer: true,
                attribution:'USGS - The National Map'
            }),
            new OpenLayers.Layer.Vector('Vector Layer') // not necessary
        ]
    });

    var proj = new OpenLayers.Projection('EPSG:4326');
    var mercator = new OpenLayers.Projection('EPSG:900913');
    var point = new OpenLayers.LonLat(-84.445, 33.7991);
    map.setCenter(point.transform(proj, mercator), 12);
}

$(document).ready(initializeMap);

// query response must have data named wkt
function parseFeaturesIntoArray(queryResult) {

    var features = [];
    var options = {
        'internalProjection': map.baseLayer.projection, 
        'externalProjection': new OpenLayers.Projection('EPSG:4269')
    };   
    var parser = new OpenLayers.Format.WKT(options);

    var resultBindings = queryResult.results.bindings;
    for (var i = 0; i < resultBindings.length; i++) {
        if(resultBindings[i].wkt) {
            
            var wkt2 = resultBindings[i].wkt.value;
            if (wkt2.split(/\>/)[1] != undefined) {
                wkt2 = wkt2.split(/\>/)[1];
            }
            var feat = parser.read(wkt2);
            if (feat != undefined) {
                features.push(feat);        
            }
        }  
    }

    return features;
}

// global variable so that extent contains all layers
var bounds = new OpenLayers.Bounds();
function findNewBounds(features) {

    for (i=0; i<features.length; ++i) {
        bounds.extend(features[i].geometry.getBounds()); 
    }
}

function hideAllVectorLayers() {
    for(var i = 0; i < vectorLayers.length; i++) {
        vectorLayers[i].setVisibility(false);
    }
}

function showAllVectorLayers() {
    for(var i = 0; i < vectorLayers.length; i++) {
        vectorLayers[i].setVisibility(true);
    }
}

function showOnlySelectedLayer(layerID) {
    for(var i = 0; i < vectorLayers.length; i++) {
        if(vectorLayers[i].features[0].id == layerID) {
            hideAllVectorLayers();
            vectorLayers[i].setVisibility(true);
            selectControl.select(vectorLayers[i].features[0]);
        }
    }
}

function drawVectors(features, vectorLayerStyle) {

    var newVectorLayer;

    if(vectorLayerStyle != null) { 
        newVectorLayer = new OpenLayers.Layer.Vector("styled vector layer", {styleMap: vectorLayerStyle});
    
    } else {
        newVectorLayer = new OpenLayers.Layer.Vector();
    }

    newVectorLayer.addFeatures(features);
    map.addLayer(newVectorLayer);

    findNewBounds(features);
    map.zoomToExtent(bounds);

    vectorLayers.push(newVectorLayer);

    selectControl = new OpenLayers.Control.SelectFeature(
        vectorLayers,
        {
            onSelect: function(event) { 
                hideAllVectorLayers();
                event.layer.setVisibility(true); 
            } ,
            onUnselect: function(event) { 
                showAllVectorLayers(); 
            }
            /* 
             clickout: true, toggle: false,
             multiple: false, hover: false,
             toggleKey: "ctrlKey", // ctrl key removes from selection
             multipleKey: "shiftKey" // shift key adds to selection
            */
        }
    );

    map.addControl(selectControl);
    selectControl.activate();
}

function parseFeaturesAndDrawVectors(msg)
{   
    var style = new OpenLayers.StyleMap({
        "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: "blue",
            strokeColor:"black",
            graphicName:"circle",
            rotation:0,
            pointRadius:10
        }, OpenLayers.Feature.Vector.style["default"])),
        "select":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor:"yellow",
            strokeColor:"black",
            graphicName:"circle",
            rotation:0,
            pointRadius:10
        }, OpenLayers.Feature.Vector.style["select"])),
        "highlight":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor:"yellow",
            strokeColor:"black",
            graphicName:"circle",
            rotation:0,
            pointRadius:10
        }, OpenLayers.Feature.Vector.style["highlight"]))
    });
    
    var features = parseFeaturesIntoArray(msg);
    drawVectors(features, style);
}