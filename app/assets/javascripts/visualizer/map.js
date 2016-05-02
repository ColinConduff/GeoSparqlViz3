
// global variables 
var map;
var selectControl;
var vectorLayers = [];

function initializeMap() {

    map = new ol.Map({
        target: 'map', 
        controls: ol.control.defaults().extend([
            new ol.control.ScaleLine({
                units: 'm'
            })
        ]),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })//,
            // new ol.layer.Tile({
            //   source: new ol.source.XYZ({
            //     'SmallScale',
            //     'http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/${z}/${y}/${x}', {
            //         sphericalMercator: true,
            //         isBaseLayer: true,
            //         attribution:'USGS - The National Map'
            //     }
            //   })
            // }),

            // new ol.layer.Tile({
            //   source: new ol.source.XYZ({
            //     'NationalMapLarge',
            //     'http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/${z}/${y}/${x}', {
            //         sphericalMercator: true,
            //         isBaseLayer: true,
            //         attribution:'USGS - The National Map'
            //     }
            //   })
            // })
        ],
        view: new ol.View({
            // projection: 'EPSG:900913', // don't think this actually does anything
            // maxResolution: 156543.0339, // don't think this actually does anything
            //displayProjection: 'EPSG:4326', // not sure if this works or is necessary 
            center: new ol.proj.transform(
                [-84.445, 33.7991],                                      
                'EPSG:4326',                       
                'EPSG:900913'
            ),
            zoom: 2,
            maxZoom: 18
        })
    });
}

$(document).ready(initializeMap);

// the following is used to highlight features on click events /////////////

// var select = null;
// var selectSingleClick = new ol.interaction.Select();
// var selectElement = document.getElementById('type');

// var changeInteraction = function() {
//     if (select !== null) {
//       map.removeInteraction(select);
//     }
//     var value = selectElement.value;
//     if (value == 'singleclick') {
//       select = selectSingleClick;
    
//     } else {
//       select = null;
//     }

//     if (select !== null) {
//       map.addInteraction(select);
//       select.on('select', function(e) {
//         var message = '&nbsp;' +
//             e.target.getFeatures().getLength() +
//             ' selected features (last operation selected ' + 
//             e.selected.length +
//             ' and deselected ' + 
//             e.deselected.length + 
//             ' features)';
//         document.getElementById('status').innerHTML = message;
//       });
//     }
// };

// selectElement.onchange = changeInteraction;
// changeInteraction();

// end feature highlight on click event code /////////////////////////////////

function hideAllVectorLayers() {
    for(var i = 0; i < vectorLayers.length; i++) {
        vectorLayers[i].setVisible(false); 
    }
}

function showAllVectorLayers() {
    for(var i = 0; i < vectorLayers.length; i++) {
        vectorLayers[i].setVisible(true); 
    }
}

// not sure if this works with ol 3
// function showOnlySelectedLayer(layerID) {
//     for(var i = 0; i < vectorLayers.length; i++) {
//         if(vectorLayers[i].features[0].id == layerID) {
//             hideAllVectorLayers();
//             vectorLayers[i].setVisible(true); 
//             selectControl.select(vectorLayers[i].features[0]); 
//         }
//     }
// }

// query response must have data named wkt
function parseFeaturesIntoArray(queryResult) {

    var features = [];   
    var parser = new ol.format.WKT();

    var resultBindings = queryResult.results.bindings;
    for (var i = 0; i < resultBindings.length; i++) {
        if(resultBindings[i].wkt) {
            
            var wkt2 = resultBindings[i].wkt.value;
            if (wkt2.split(/\>/)[1] != undefined) {
                wkt2 = wkt2.split(/\>/)[1];
            }
            var feat = parser.readFeature(wkt2, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            if (feat != undefined) {
                features.push(feat);        
            }
        }  
    }

    return features;
}

// // global variable so that extent contains all layers
// //var bounds = map.getExtent();
// function findNewBounds(features) {

//     for (i=0; i<features.length; ++i) {
//         console.log(features[i]);
//         var extent = features[i].geometry.getExtent();
//         map.getView().fit(extent, map.getSize());
//         //bounds.extend(features[i].geometry.getExtent()); 
//     }
// }

function drawVectors(features, vectorLayerStyle) {

    var newVectorLayer;

    // still need to add style
    // {styleMap: vectorLayerStyle}
    newVectorLayer = new ol.layer.Vector({ 
        source: new ol.source.Vector({
            features: features,
            // extent: ol.proj.transformExtent(
            //     [-20037508, -20037508, 20037508, 20037508], 
            //     'EPSG:4326', 
            //     'EPSG:900913'
            // )
        })
    });

    map.addLayer(newVectorLayer);
    
    var extent = newVectorLayer.getSource().getExtent();
    map.getView().fit(extent, map.getSize());

    //findNewBounds(features);
    
    //map.zoomToExtent(bounds); // old
    
    // if(features.length != 0) {
    //     findNewBounds(features);
    //     //map.getView().fit(bounds, map.getSize()); // not sure if this works 
    // }

    // get extent of all layers, this is a better way 
    // var extent = ol.extent.createEmpty(); // make this global like before
    // projecten.getLayers().forEach(function(layer) {
    //   ol.extent.extend(extent, layer.getSource().getExtent());
    // });
    // map.getView().fit(extent, map.getSize());
   
    vectorLayers.push(newVectorLayer);

    // old 
    // selectControl = new OpenLayers.Control.SelectFeature(
    //     vectorLayers,
    //     {
    //         onSelect: function(event) { 
    //             hideAllVectorLayers();
    //             event.layer.setVisibility(true);  // setVisible() in ol 3
    //         } ,
    //         onUnselect: function(event) { 
    //             showAllVectorLayers(); 
    //         }
    //     }
    // );

    // map.addControl(selectControl); // old
    // selectControl.activate(); // old
}

function parseFeaturesAndDrawVectors(msg)
{   
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
          })
        })
        // "default":new ol.Style(ol.Util.applyDefaults({
        //     fillColor: "blue",
        //     strokeColor:"black",
        //     graphicName:"circle",
        //     rotation:0,
        //     pointRadius:10
        // }, ol.Feature.Vector.style["default"])),
        // "select":new ol.Style(ol.Util.applyDefaults({
        //     fillColor:"yellow",
        //     strokeColor:"black",
        //     graphicName:"circle",
        //     rotation:0,
        //     pointRadius:10
        // }, ol.Feature.Vector.style["select"])),
        // "highlight":new ol.Style(ol.Util.applyDefaults({
        //     fillColor:"yellow",
        //     strokeColor:"black",
        //     graphicName:"circle",
        //     rotation:0,
        //     pointRadius:10
        // }, ol.Feature.Vector.style["highlight"]))
    });
    
    var features = parseFeaturesIntoArray(msg);
    drawVectors(features, style);
}