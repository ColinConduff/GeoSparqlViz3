
function baseQueryRequest(endpoint, query, ifSuccessfulDoThis)
{
    //var endpoint = "http://geoquery.cs.jmu.edu:8081/parliament/sparql";

    var request = $.ajax({
        type: "GET",
        url: endpoint,
        dataType: "json",
        data: {
            "query": query,
            "output": "json"
        }
    });
    
    request.done(function( msg ) {
        ifSuccessfulDoThis(msg);
    });
    
    request.fail(function(jqXHR, textStatus, errorThrown) {
        alert( "Request Failed: " + textStatus);
        alert(errorThrown + ": " + jqXHR.responseText);
    });
}

function updateTable(resultMsg, tableDivId) {
    var container = $('#' + tableDivId);
    var tbl = $('<table>').attr('id', 'basicTable').attr("class", "resultTable");

    /* Create Table Headings */
    var $tr = $('<tr>').attr("class", "resultTable");
    
    for (var i = 0; i < resultMsg['head']['vars'].length; ++i) {
        $tr.append($('<th>').text(resultMsg['head']['vars'][i]));
    }
    
    tbl.append($tr);

    for (var j=0; j < resultMsg['results']['bindings'].length; ++j) {
        $tr = $('<tr>').attr("class", "resultTable");
        
        for (var key in resultMsg['results']['bindings'][j]) {
            var td = $('<td>').attr('class', 'resultCell');
            if(resultMsg['results']['bindings'][j][key].value.length > 500)
            {
                td.text("Too much text to display.");
            
            } else {
                 td.text(resultMsg['results']['bindings'][j][key].value);
            }
            $tr.append(td);
        }

        tbl.append($tr);
    }
    
    container.empty();
    container.append(tbl);
}

function getFeatureTypes(selector, sparqlEndpoint)
{
    var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT DISTINCT ?type WHERE { ?feature rdf:type ?type . }";
    
    var willDoThisUponSuccessfulQuery = function(msg) {
        $(selector).empty();
        $(selector).append("<option>Select a Feature Type</option>");
        var arrayOfObjects = msg.results.bindings;

        for(var i = 0; i < arrayOfObjects.length; i++)
        {
            $(selector).append("<option>" + arrayOfObjects[i].type.value + "</option>");
        }
        $(selector).selectpicker('refresh');
    };

    baseQueryRequest(sparqlEndpoint, query, willDoThisUponSuccessfulQuery);
    
}

function getFeatureRelationships(selector, selectedFeatureType, sparqlEndpoint)
{
    var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT DISTINCT ?rel WHERE { ?feature rdf:type <" + selectedFeatureType + "> ; ?rel ?obj . }";
    
    var willDoThisUponSuccessfulQuery = function(msg) {
        $(selector).empty();
        $(selector).append("<option>Select a Feature Relationship</option>");
        var arrayOfObjects = msg.results.bindings;

        for(var i = 0; i < arrayOfObjects.length; i++)
        {
            $(selector).append("<option>" + arrayOfObjects[i].rel.value + "</option>");
        }
        $(selector).selectpicker('refresh');
    };
    
    baseQueryRequest(sparqlEndpoint, query, willDoThisUponSuccessfulQuery);
}

function getFeatureAndLabel(selector, feature, relationship, searchTerm, selectorForSpatial, selectorForBinary, withBoundary, buffer, featureFillColor, sparqlEndpoint)
{
    var query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?feature ?label WHERE { ?feature rdf:type <' + feature + '> . ?feature rdfs:label ?label . ?feature <' + relationship + '> ?obj . FILTER( regex(str(?obj), "' + searchTerm + '", "i" ) ) . }';

    var willDoThisUponSuccessfulQuery = function(msg) {
        $(selector).empty();
        $(selectorForSpatial).empty();
        $(selectorForBinary).empty();
        var arrayOfObjects = msg.results.bindings;

        $(selector).append("<option data-featureid=undefined>Select a Feature</option>");
        $(selectorForSpatial).append("<option featureSpatialID=all>All Features</option>");
        $(selectorForBinary).append("<option featureBinaryID=undefined>Select a Feature</option>");

        for(var i = 0; i < arrayOfObjects.length; i++)
        {
          $(selector).append("<option data-featureid="+ arrayOfObjects[i].feature.value +">" + arrayOfObjects[i].label.value + "</option>");
          $(selectorForSpatial).append("<option featureSpatialID="+ arrayOfObjects[i].feature.value +">" + arrayOfObjects[i].label.value + "</option>");
          $(selectorForBinary).append("<option featureBinaryID="+ arrayOfObjects[i].feature.value +">" + arrayOfObjects[i].label.value + "</option>");
          
          getFeatureWKTData(arrayOfObjects[i].feature.value, withBoundary, buffer, featureFillColor, sparqlEndpoint);
        }
        $(selector).selectpicker('refresh');
        $(selectorForSpatial).selectpicker('refresh');
        $(selectorForBinary).selectpicker('refresh');
    };
    
    baseQueryRequest(sparqlEndpoint, query, willDoThisUponSuccessfulQuery);
}

function sendQueryAndCallDrawVectors(query, selectedFeature, featureFillColor, sparqlEndpoint) 
{
    var willDoThisUponSuccessfulQuery = function(msg) {
        drawVectorsForFeatures(msg, selectedFeature, featureFillColor);
    };
    
    baseQueryRequest(sparqlEndpoint, query, willDoThisUponSuccessfulQuery);
}

function getFeatureWKTData(selectedFeature, withBoundary, buffer, featureFillColor, sparqlEndpoint)
{
    if(withBoundary)
    {
        var queryWithBoundary = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT ?wkt WHERE { <' + selectedFeature + '> geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wktf . BIND(geof:boundary(?wktf) AS ?wkt) . }';
    
        sendQueryAndCallDrawVectors(queryWithBoundary, selectedFeature, featureFillColor, sparqlEndpoint);
    }
    else if (buffer != null)
    {
        var queryWithBuffer = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT ?wkt WHERE { <' + selectedFeature + '> geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wktf . BIND(geof:buffer(?wktf, ' + buffer + ', units:metre) AS ?wkt) . }';

        sendQueryAndCallDrawVectors(queryWithBuffer, selectedFeature, featureFillColor, sparqlEndpoint);
    }
    else 
    {
        var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> SELECT ?wkt WHERE { <' + selectedFeature + '> geo:hasGeometry ?g . ?g geo:asWKT ?wkt . }';
    
        sendQueryAndCallDrawVectors(query, selectedFeature, featureFillColor, sparqlEndpoint);
    }
}

function getFeatureAttributes(selectedFeature, selectedLabel, attributeTableTarget, attributeModalTitle, sparqlEndpoint)
{
    var query = 'SELECT ?rel ?obj WHERE { <' + selectedFeature + '> ?rel ?obj . }'
    
    var willDoThisUponSuccessfulQuery = function(msg) {
        var featureAttributes = msg.results.bindings;

        $(attributeTableTarget+' > tbody').empty();

        for(var i = 0; i < featureAttributes.length; i++)
        {
            var type = featureAttributes[i].obj.type;
            var val = featureAttributes[i].obj.value;
            var uri = featureAttributes[i].rel.value;

            $(attributeTableTarget+' > tbody:last-child').append('<tr><td>' + uri + '</td><td>' + type + ' : ' + val + '</td></tr>');
        }

        $(attributeModalTitle).empty();
        $(attributeModalTitle).append('<h4 class="modal-title">' + selectedLabel + '</h4>');
    };
    
    baseQueryRequest(sparqlEndpoint, query, willDoThisUponSuccessfulQuery);
}

// spatial relationship functionality 

function getSpatialRelationshipResultsOfManyToOne(feature1Type, feature1Relationship, feature1SearchTerm, feature2, operation, spatialLayerFillColor)
{
    var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT DISTINCT ?feature ?label ?wkt1 WHERE { ?feature rdf:type <' + feature1Type + '> . ?feature rdfs:label ?label . ?feature <' + feature1Relationship +'> ?obj1 . FILTER( regex(str(?obj1), "' + feature1SearchTerm + '", "i" ) ) . ?feature geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wkt1 . <' + feature2 + '> geo:hasGeometry ?g2 . ?g2 geo:asWKT ?wktf2 . BIND(?wktf2 AS ?wkt2) . FILTER (geof:' + operation + '(?wkt1, ?wkt2)) .}';
    var willDoThisUponSuccessfulQuery = function(msg) { 
        updateTable(msg, 'spatialRelResultsTable');
        drawVectorsForSpatialRelationshipQuery(msg, spatialLayerFillColor);
    }

    var endpoint = "http://geoquery.cs.jmu.edu:8081/parliament/sparql";
    baseQueryRequest(endpoint, query, willDoThisUponSuccessfulQuery);
}

function getSpatialRelationshipResultsOf2Features(feature1, feature2, operation, spatialLayerFillColor)
{
    var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT DISTINCT ?feature ?label ?wkt1 WHERE { <' + feature1 + '> geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wktf1 . BIND(?wktf1 AS ?wkt1) . <' + feature2 + '> geo:hasGeometry ?g2 . ?g2 geo:asWKT ?wktf2 . BIND(?wktf2 AS ?wkt2) . FILTER (geof:' + operation + '(?wkt1, ?wkt2)) .}';
    var willDoThisUponSuccessfulQuery = function(msg) { 
        updateTable(msg, 'spatialRelResultsTable');
        drawVectorsForSpatialRelationshipQuery(msg, spatialLayerFillColor);
    }

    var endpoint = "http://geoquery.cs.jmu.edu:8081/parliament/sparql";
    baseQueryRequest(endpoint, query, willDoThisUponSuccessfulQuery);
}

function getSpatialRelationshipResultsOfManyToMany(feature1Type, feature1Relationship, feature1SearchTerm, feature2Type, feature2Relationship, feature2SearchTerm, operation, spatialLayerFillColor)
{
    var query = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT DISTINCT ?feature ?label ?wkt1 WHERE { ?feature rdf:type <' + feature1Type + '> . ?feature rdfs:label ?label . ?feature <' + feature1Relationship +'> ?obj1 . FILTER( regex(str(?obj1), "' + feature1SearchTerm + '", "i" ) ) . ?feature geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wkt1 . ?feature2 rdf:type <' + feature2Type + '> . ?feature2 rdfs:label ?label2 . ?feature2 <' + feature2Relationship +'> ?obj2 . FILTER( regex(str(?obj2), "' + feature2SearchTerm + '", "i" ) ) . ?feature2 geo:hasGeometry ?g2 . ?g2 geo:asWKT ?wkt2 . FILTER (geof:' + operation + '(?wkt1, ?wkt2)) .}';
    var willDoThisUponSuccessfulQuery = function(msg) { 
        updateTable(msg, 'spatialRelResultsTable');
        drawVectorsForSpatialRelationshipQuery(msg, spatialLayerFillColor);
    }

    var endpoint = "http://geoquery.cs.jmu.edu:8081/parliament/sparql";
    baseQueryRequest(endpoint, query, willDoThisUponSuccessfulQuery);
}

// binary spatial functionality 

function getBinarySpatialDataOfTwoFeaturesAndDrawVectors(feature1, feature2, operation, binaryLayerFillColor){

    if(operation == "distance")
    {
        var distanceQuery = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT ?distance WHERE { <' + feature1 + '> geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wkt1 . <' + feature2 + '> geo:hasGeometry ?g2 . ?g2 geo:asWKT ?wkt2 . BIND(geof:distance(?wkt1, ?wkt2, units:metre) AS ?distance) . }';
    
        var willDoThisUponSuccessfulQuery = function(msg) { 
            updateTable(msg, 'binarySpatialResultsTable');
        }

        var endpoint = "http://geoquery.cs.jmu.edu:8081/parliament/sparql";
        baseQueryRequest(endpoint, distanceQuery, willDoThisUponSuccessfulQuery);
    }
    else
    {
        var nonDistanceOperationQuery = 'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/> SELECT ?wkt WHERE { <' + feature1 + '> geo:hasGeometry ?g1 . ?g1 geo:asWKT ?wkt1f . BIND(?wkt1f AS ?wkt1) . <' + feature2 + '> geo:hasGeometry ?g2 . ?g2 geo:asWKT ?wkt2f . BIND(?wkt2f AS ?wkt2) . BIND(geof:' + operation + '(?wkt1, ?wkt2) AS ?wkt) . }';

        var willDoThisUponSuccessfulQuery = function(msg) { 
            drawVectorsForBinaryRelationshipQuery(msg, binaryLayerFillColor);
            updateTable(msg, 'binarySpatialResultsTable');
        }

        var endpoint = "http://geoquery.cs.jmu.edu:8081/parliament/sparql";
        baseQueryRequest(endpoint, nonDistanceOperationQuery, willDoThisUponSuccessfulQuery);
    }
}