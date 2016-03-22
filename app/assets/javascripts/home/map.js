// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

var map;
var selectControl;
var vectorLayers = [];
var toggleFullScreenMapBtnClicked = false;

$('.firstItemInactive').html('<span class="glyphicon glyphicon-search"></span>');
$('.firstItemActive').html('<span class="glyphicon glyphicon-search"></span>');

$('<button />', {
  class: 'firstItemInactive',
  type: 'button',
  html: '<span class="glyphicon glyphicon-arrow-left"></span>'
});

function toggleFullScreenMapBtn() { 
    if(toggleFullScreenMapBtnClicked == false) {
        $('.sideBar').hide();
        $('.mapOuterDiv').removeClass('col-lg-6');
        map.updateSize();
        toggleFullScreenMapBtnClicked = true;

    } else {
        $('.sideBar').show();
        $('.mapOuterDiv').addClass('col-lg-6');
        map.updateSize();
        toggleFullScreenMapBtnClicked = false;
    }
}

function initializeMap() {

    var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
        restrictedExtent = maxExtent.clone();
    
    var panel = new OpenLayers.Control.Panel({ displayClass: 'Panel1' });
    panel.addControls([
        new OpenLayers.Control.Button({
            displayClass: 'first', 
            trigger: toggleFullScreenMapBtn, 
            title: 'Button is to be clicked'
        })
    ]);

    map = new OpenLayers.Map({
        div: 'map', 
        controls: [
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher(),
            panel
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

function parseFeaturesIntoArray(queryResult) {

    var features = [];
    var options = {
        'internalProjection': map.baseLayer.projection, 
        'externalProjection': new OpenLayers.Projection('EPSG:4269')
    };   
    var parser = new OpenLayers.Format.WKT(options);

    for (i=0; i < queryResult['results']['bindings'].length; ++i) {
        var pointArray = [];
        
        for (var key in queryResult['results']['bindings'][i]) {
            if(queryResult['results']['bindings'][i][key]['datatype'] == "http://www.opengis.net/ont/geosparql#wktLiteral") {
                var wkt2 = queryResult['results']['bindings'][i][key]['value'];
                if (wkt2.split(/\>/)[1] != undefined) {
                    wkt2 = wkt2.split(/\>/)[1];
                }
                var feat = parser.read(wkt2);
                if (feat != undefined) {
                    features.push(feat);        
                }
            } else if (queryResult['results']['bindings'][i][key]['datatype'] == "http://www.w3.org/2001/XMLSchema#double") {
                pointArray.push(queryResult['results']['bindings'][i][key]['value']);
            }
        }

        // expects point array to contain latitude then longitude
        // the lat and lon are then reversed 
        // if the point array contains more or less than two then it is not a lon lat point
        if(pointArray.length == 2) {
            var point = new OpenLayers.Geometry.Point(pointArray[1], pointArray[0]);
            var proj = new OpenLayers.Projection('EPSG:4326');
            point = point.transform(proj, map.getProjectionObject());
            
            var pointFeature = new OpenLayers.Feature.Vector(point, null, null);
            features.push(pointFeature);
        }
    }

    return features;
}

// global variable so that extent contains all layers
var bounds = new OpenLayers.Bounds();
function findNewBounds(features) {

    for (i=0; i<features.length; ++i) {
        // if(features[i].geometry == undefined) {
        //     for (j=0; j<features[i].length; j++) {
        //         bounds.extend(features[i][j].geometry.getBounds());
        //     }
        
        // } else {
            bounds.extend(features[i].geometry.getBounds()); 
        //}
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

function drawVectorsForFeatures(resultMsg, featureID, featureFillColor) {

    var features = parseFeaturesIntoArray(resultMsg);
    
    // add layerID attribute to options in dropdown menus to enable 
    // selecting specific layers
    $('#featureResults1 > option[data-featureid="' + featureID + '"]').attr('data-layerid', features[0].id);
    $('#featureResults2 > option[data-featureid="' + featureID + '"]').attr('data-layerid', features[0].id);

    // create style object for features 
    var style = new OpenLayers.StyleMap({
        "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: featureFillColor,
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

    drawVectors(features, style);
}

function drawVectorsForSpatialRelationshipQuery(resultMsg, spatialFillColor) {

    var features = parseFeaturesIntoArray(resultMsg);

    // specific style for spatial relationship query results 
    var style = new OpenLayers.StyleMap({
        "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: spatialFillColor,
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

    drawVectors(features, style);
}

function drawVectorsForBinaryRelationshipQuery(resultMsg, binaryFillColor) {

    var features = parseFeaturesIntoArray(resultMsg);

    // specific style for binary relationship query results 
    var style = new OpenLayers.StyleMap({
        "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: binaryFillColor,
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

    drawVectors(features, style);
}

function submitquery(endpoint, query)
{
    console.log(endpoint);
    console.log(query);
    var request = $.ajax({
        type: "GET",
        url: endpoint, //"http://geoquery.cs.jmu.edu:8081/parliament/sparql",
        dataType: "json",
        data: {
                "query": query,
                "output": "json"
            }
    });

    request.done(function( msg ) {
        // specific style for binary relationship query results 
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
        updateTable(msg, "tableWrap");
    });
    
    request.fail(function(jqXHR, textStatus, errorThrown) {
        alert( "Request Failed: " + textStatus);
        alert(errorThrown + ": " + jqXHR.responseText);
    });
}