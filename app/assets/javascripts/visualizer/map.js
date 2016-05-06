
// See views/visualizer/index.html.erb
// The following code initializes the map and draws map layers on it
// using Well-Known Text (wkt) data that is returned from some sparql queries

// global variables 
var map;
var selectControl; // this isn't being used 
var vectorLayers = []; // this isn't really being used either

function initializeMap() {

    map = new ol.Map({
        target: 'map', // css selector in index.html.erb
        controls: ol.control.defaults().extend([
            new ol.control.OverviewMap(),
            new ol.control.FullScreen()
        ]),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })//,

            // USGS has a map api, contact Rick Brown (I think?) if you want to 
            // try to get this working

            // new ol.layer.Tile({
            //   source: new ol.source.XYZ({
            //     'SmallScale',
            //     url: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/${z}/${y}/${x}', {
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
            center: new ol.proj.transform(
                [-84.445, 33.7991],                                      
                'EPSG:4326',                       
                'EPSG:900913'
            ),
            zoom: 3,
            maxZoom: 18
        })
    });

    // draw polygon stuff /////////////////////////////////////////////
    
    // the plan is to be able to draw a polygon, get the wkt data related to it
    // and then allow users to use that wkt data in a query
    // So a user could find all features nearby, within, etc with relation to the polygon

    // var featuresCollection = new ol.Collection();
    // var featureOverlay = new ol.layer.Vector({
    //     source: new ol.source.Vector({features: featuresCollection}),
    //     style: new ol.style.Style({
    //         fill: new ol.style.Fill({
    //             color: 'rgba(255, 255, 255, 0.2)'
    //         }),
    //         stroke: new ol.style.Stroke({
    //             color: '#ffcc33',
    //             width: 2
    //         }),
    //         image: new ol.style.Circle({
    //             radius: 7,
    //             fill: new ol.style.Fill({
    //                 color: '#ffcc33'
    //             })
    //         })
    //     })
    // });
    // featureOverlay.setMap(map);

    // var draw = new ol.interaction.Draw({
    //     features: featuresCollection,
    //     type: 'Polygon'
    // });
    // map.addInteraction(draw);
    ////////////////////////////////////////////////////////////////
}

$(document).ready(initializeMap);

// not currently being used
function hideAllVectorLayers() {
    for(var i = 0; i < vectorLayers.length; i++) {
        vectorLayers[i].setVisible(false); 
    }
}

// not currently being used
function showAllVectorLayers() {
    for(var i = 0; i < vectorLayers.length; i++) {
        vectorLayers[i].setVisible(true); 
    }
}

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

function drawVectors(features) {

    var newVectorLayer = new ol.layer.Vector({ 
        source: new ol.source.Vector({
            features: features
        })
        // I tried adding styles here to color maps different colors, etc.
        // but it didn't work for whatever reason
    });

    map.addLayer(newVectorLayer);
    
    // Move the map to where the map layers have been created
    var extent = newVectorLayer.getSource().getExtent();
    map.getView().fit(extent, map.getSize());
   
    // global vectorLayers array was used to get the extent
    // of all of the layers generated from separate queries.  
    // it's not currently being used.  
    vectorLayers.push(newVectorLayer);
}

function parseFeaturesAndDrawVectors(msg)
{   
    var features = parseFeaturesIntoArray(msg);
    drawVectors(features);
}