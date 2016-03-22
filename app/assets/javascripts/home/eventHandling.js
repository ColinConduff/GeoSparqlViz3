$(document).ready(function() {  

  // toggle the none, buffer, and boundary radial buttons
  var bufferTextFieldHidden1 = true;

  $('.toggleFeatureOptions1').click(function() {
    if(!bufferTextFieldHidden1) {
      $('.buffer1').hide();
      bufferTextFieldHidden1 = true;
    }
    $('.featureOptions1').toggle();
  });

  $('#bufferRadio1').click(function() {
    $('.buffer1').show();
    bufferTextFieldHidden1 = false;
  });

  $('#noneRadio1').click(function() {
    $('.buffer1').hide();
    bufferTextFieldHidden1 = true;
  });

  $('#boundaryRadio1').click(function() {
    $('.buffer1').hide();
    bufferTextFieldHidden1 = true;
  });

  var bufferTextFieldHidden2 = true;

  $('.toggleFeatureOptions2').click(function() {
    if(!bufferTextFieldHidden2) {
      $('.buffer2').hide();
      bufferTextFieldHidden2 = true;
    }
    $('.featureOptions2').toggle();
  });

  $('#bufferRadio2').click(function() {
    $('.buffer2').show();
    bufferTextFieldHidden2 = false;
  });

  $('#noneRadio2').click(function() {
    $('.buffer2').hide();
    bufferTextFieldHidden2 = true;
  });

  $('#boundaryRadio2').click(function() {
    $('.buffer2').hide();
    bufferTextFieldHidden2 = true;
  });
  
  $('.step1').hide();
  $('.step2').hide();
  $('.step3').hide();
  $('.step3half').hide();
  $('.step4').hide();
  $('.step5').hide();

  // hide dropdown/select menus until data is queried
  
  $('#featureRelationships1').hide();
  $('#searchBar1').hide();
  $('.featureSearch1').hide();
  $('#featureResults1').hide();
  $('.displayAttributesBtn1').hide();
  
  $('.toggleFeatureOptions1').hide();
  $('.featureOptions1').hide();
  $('.buffer1').hide();

  // feature two stuff
  $('.menuGrouping2').hide();
  $('#featureTypes2').hide();
  $('#featureRelationships2').hide();
  $('#searchBar2').hide();
  $('.featureSearch2').hide();
  $('#featureResults2').hide();
  $('.displayAttributesBtn2').hide();

  $('.toggleFeatureOptions2').hide();
  $('.featureOptions2').hide();
  $('.buffer2').hide();

  $('.menuGrouping3').hide();
  $('.spatialRelationshipGroup').hide();
  $('#featuresForSpatial1').hide();
  $('#featuresForSpatial2').hide();
  $('#availableOperationsForSpatial').hide();

  $('.menuGrouping4').hide();
  $('.binaryGroup').hide();
  $('#featuresForBinary1').hide();
  $('#featuresForBinary2').hide();
  $('#availableOperationsForBinary').hide();

  function initializeSelectPicker() {
    $('.selectpicker').selectpicker({width: '100%', liveSearch: true});
    return true;
  }

  function addSparqlEndpointOptionsToSelectPicker(selector) {
    // if there is only one option, on change does not recognize clicking the first option
    $(selector).append("<option>Select a Sparql Endpoint</option>");
    $(selector).append("<option>http://geoquery.cs.jmu.edu:8081/parliament/sparql</option>");
    $(selector).append("<option>http://www.lotico.com:3030/lotico/sparql</option>");
    $(selector).selectpicker('refresh');
  }

  function initializeSelectPickerAndAddSparqlEndpointOptions(selector1, selector2) {
    initializeSelectPicker();
    addSparqlEndpointOptionsToSelectPicker(selector1);
    addSparqlEndpointOptionsToSelectPicker(selector2);
  }

  initializeSelectPickerAndAddSparqlEndpointOptions("#sparqlEndpoint1", "#sparqlEndpoint2")

  // add glyphicon to map
  $('.firstItemInactive').html('<button class="btn btn-default"><span class="glyphicon glyphicon-fullscreen"></span></button>');
  //addTabs('#tabList', '#tabPanel', 'some stuff');

  var selectedSparqlEndpoint1;
  $("#sparqlEndpoint1").change(function () {
    selectedSparqlEndpoint1 = $('#sparqlEndpoint1').children(':selected').text();
    getFeatureTypes('#featureTypes1', selectedSparqlEndpoint1);
    $('.step1').show();
    $('#featureTypes1').show();
  });

  var selectedFeatureType1 = "";

  // when a feature type is selected, get all of the relationships related
  // to that feature type
  $("#featureTypes1").change(function () {
    selectedFeatureType1 = $('#featureTypes1').children(':selected').text();
    getFeatureRelationships('#featureRelationships1', selectedFeatureType1, selectedSparqlEndpoint1);

    $('.hideUntilFeatureTypeSelected').show();
    $('#featureRelationships1').show();
    $('#searchBar1').show();
    $('.toggleFeatureOptions1').show();
    $('.featureSearch1').show();
    $('.step2').show();
  });

  // when the search button is clicked,
  // use all of the user specified information to find all of the feature URIs
  // and lables in the dataset matching the user's specifications
  $('.featureSearch1').click(function(){
    var selectedFeatureRel = $('#featureRelationships1').children(':selected').text();
    var searchTerm = $('#searchBar1').val();
    var withBoundary = false;
    var bufferValue = null;
    if($('#boundaryRadio1').is(':checked')) { withBoundary = true; }
    if($('#bufferRadio1').is(':checked')) { bufferValue = $('.buffer1').val(); }
    
    getFeatureAndLabel('#featureResults1', selectedFeatureType1, selectedFeatureRel, searchTerm, '#featuresForSpatial1', '#featuresForBinary1', withBoundary, bufferValue, "red", selectedSparqlEndpoint1);
    $('#featureResults1').show();
    
    $('.step3').show();

    $('.menuGrouping2').show();
  });

  // find one feature's attribute data and fill a table with that data
  $("#featureResults1").change(function () {
    // hide all other features on the map
    var layerID = $('#featureResults1').children(':selected').data('layerid');
    showOnlySelectedLayer(layerID);

    var selectedFeature = $('#featureResults1').children(':selected').data('featureid');
    var selectedLabel = $('#featureResults1').children(':selected').text();
    var attributeTableTarget = '.featureAttributesList1';
    var attributeModalTitle = '.attributeModalTitle1';
    getFeatureAttributes(selectedFeature, selectedLabel, attributeTableTarget, attributeModalTitle, selectedSparqlEndpoint1);
    $('.displayAttributesBtn1').show();
  });

  // beginning feature 2 //////////////////////////////
  // do all of the same stuff for the second feature

  var selectedSparqlEndpoint2;
  $("#sparqlEndpoint2").change(function () {
    selectedSparqlEndpoint2 = $('#sparqlEndpoint2').children(':selected').text();
    $('.step3half').show();
    getFeatureTypes('#featureTypes2', selectedSparqlEndpoint2);
  });

  var selectedFeatureType2 = "";

  $("#featureTypes2").change(function () {
    selectedFeatureType2 = $('#featureTypes2').children(':selected').text();
    getFeatureRelationships('#featureRelationships2', selectedFeatureType2, selectedSparqlEndpoint2);
    
    $('#featureRelationships2').show();
    $('#searchBar2').show();
    $('.toggleFeatureOptions2').show();
    $('.featureSearch2').show();
    $('.step4').show();
  });

  $('.featureSearch2').click(function(){
    var selectedFeatureRel = $('#featureRelationships2').children(':selected').text();
    var searchTerm = $('#searchBar2').val();
    var withBoundary = false;
    var bufferValue = null;
    if($('#boundaryRadio2').is(':checked')) { withBoundary = true; }
    if($('#bufferRadio2').is(':checked')) { bufferValue = $('.buffer2').val(); }

    getFeatureAndLabel('#featureResults2', selectedFeatureType2, selectedFeatureRel, searchTerm, '#featuresForSpatial2', '#featuresForBinary2', withBoundary, bufferValue, "blue", selectedSparqlEndpoint2);
    $('#featureResults2').show();
    $('.step5').show();

    $('.menuGrouping3').show();
    $('.spatialRelationshipGroup').show();
    $('.spatialResultsModalBtn').hide();

    $('.menuGrouping4').show();
    $('.binaryGroup').show();
    $('.binaryResultsModalBtn').hide();
  });

  $("#featureResults2").change(function () {
    // hide all other features on the map
    var layerID = $('#featureResults2').children(':selected').data('layerid');
    showOnlySelectedLayer(layerID);

    var selectedFeature = $('#featureResults2').children(':selected').data('featureid');
    var selectedLabel = $('#featureResults2').children(':selected').text();
    var attributeTableTarget = '.featureAttributesList2';
    var attributeModalTitle = '.attributeModalTitle2';
    getFeatureAttributes(selectedFeature, selectedLabel, attributeTableTarget, attributeModalTitle, selectedSparqlEndpoint2);
    $('.displayAttributesBtn2').show();
  });

  $(".startSpatialRelBtn").click(function () {

    // available operations
    // sfWithin, sfEquals, sfContains, sfDisjoint, sfIntersects, sfOverlaps, sfTouches
    // ehEquals, ehDisjoint, ehMeet, ehOverlap, ehCovers, ehCoverdBy, ehInside, ehContains

    var feature1 = $('#featuresForSpatial1').children(':selected').attr('featureSpatialID');
    var feature2 = $('#featuresForSpatial2').children(':selected').attr('featureSpatialID');
    
    $('#availableOperationsForSpatial').selectpicker('refresh');
    var operation = $('#availableOperationsForSpatial').children(':selected').text();

    if(feature1 == "all" && feature2 == "all")
    {
      var feature1Type = selectedFeatureType1;
      var feature1Relationship = $('#featureRelationships1').children(':selected').text();
      var feature1SearchTerm = $('#searchBar1').val();

      var feature2Type = selectedFeatureType2;
      var feature2Relationship = $('#featureRelationships2').children(':selected').text();
      var feature2SearchTerm = $('#searchBar2').val();

      getSpatialRelationshipResultsOfManyToMany(feature1Type, feature1Relationship, feature1SearchTerm, feature2Type, feature2Relationship, feature2SearchTerm, operation, "green");
    }
    else if (feature1 == "all" && feature2 != "all")
    {
      var feature1Type = selectedFeatureType1;
      var feature1Relationship = $('#featureRelationships1').children(':selected').text();
      var feature1SearchTerm = $('#searchBar1').val();
      
      getSpatialRelationshipResultsOfManyToOne(feature1Type, feature1Relationship, feature1SearchTerm, feature2, operation, "green");
    }
    else if (feature1 != "all" && feature2 == "all")
    {
      var feature2Type = selectedFeatureType2;
      var feature2Relationship = $('#featureRelationships2').children(':selected').text();
      var feature2SearchTerm = $('#searchBar2').val();
      
      getSpatialRelationshipResultsOfManyToOne(feature2Type, feature2Relationship, feature2SearchTerm, feature1, operation, "green");
    }
    else if (feature1 != "all" && feature2 != "all")
    {
      getSpatialRelationshipResultsOf2Features(feature1, feature2, operation, "green");
    }
    else
    {
      alert("error!");
    }

    $('.spatialResultsModalBtn').show();
  });

  var spatialOperandsReversed = false;

  $('.reverseSpatialOperands').click(function () {
    if(spatialOperandsReversed) {
      $(".divSurroundingFeatureSetForSpatial2").detach().appendTo('.spatialOperand2');
      $(".divSurroundingFeatureSetForSpatial1").detach().appendTo('.spatialOperand1');
      spatialOperandsReversed = false;
    } else {
      $(".divSurroundingFeatureSetForSpatial2").detach().appendTo('.spatialOperand1');
      $(".divSurroundingFeatureSetForSpatial1").detach().appendTo('.spatialOperand2');
      spatialOperandsReversed = true;
    }
  });

  $(".startBinaryBtn").click(function () {

    var feature1 = $('#featuresForBinary1').children(':selected').attr('featureBinaryID');
    var feature2 = $('#featuresForBinary2').children(':selected').attr('featureBinaryID');

    if(spatialOperandsReversed) {
      feature2 = $('#featuresForBinary1').children(':selected').attr('featureBinaryID');
      feature1 = $('#featuresForBinary2').children(':selected').attr('featureBinaryID');
    }

    var binaryOperation = $('#availableOperationsForBinary').children(':selected').text();

    getBinarySpatialDataOfTwoFeaturesAndDrawVectors(feature1, feature2, binaryOperation, "green");

    $('.binaryResultsModalBtn').show();
  });

  // attempted to add tabs dynamically
  // function addTabs(tabListSelector, tabPanelSelector, tabName ) {
  //   $(tabListSelector).append('<li role="presentation"><a href="#'+tabName+'" aria-controls="'+tabName+'" role="tab" data-toggle="tab">'+tabName+'</a></li>');
  //   $(tabPanelSelector).append('<div role="tabpanel" class="tab-pane" id="'+tabName+'">');
  //   $(tabPanelSelector).append('Some content');
  //   $(tabPanelSelector).append('</div>');

  //   $(tabPanelSelector).tab('show');
  // }

  // $("#dataTabs").on('click', '.tablink,#tabList a', function (e) {
  //   e.preventDefault();
  //   $(this).tab('show');
  // });
});