
// This code is used to build the GUI in views/visualizer/index.html.erb
// The buildMenu function below is the entry point from the visualizer

// example of sparqlObjects object
// var sparqlObjects = [
//  {
//    queryName: undefined,
//    originalQuery: undefined,              // newline characters removed
//    cleanedQuery: undefined,               // bracket statements replaced
//    queryWithNewlineCharacters: undefined, // contains newline characters
//    codeMirrorQuery: undefined,            // bracket statements replaced, preserves newline characters
//    endpointName: undefined,
//    endpoint: undefined,
//    menuSelector: undefined,               // CSS selector, #menu, attach point for menu groups
//    menuGroupSelector: undefined,          // CSS selector, group related to one query
//    submitBtnSelector: undefined,          // CSS selector for submit button in menu group
//    nodes : [                        // each node is a bracket statement
//      {
//        menuSelectorID: undefined,   // CSS selector for node DOM element (dropdown menu, etc)
//        substring: undefined,        // string containing bracket statement, makes it easier to replace with data later
//        domType: undefined,          // text, dropdown, data, radio
//        parsedArguments: undefined,  // list of words in one bracket statement
//        dataToInsert: undefined      // data from query response to replace bracket statement with
//      }
//    ]
//  }
// ];

// prevent naming collisions for menu ids
// used throughout the functions in this file
var globalIDCounter = 0; 

function buildMenu(sparqlObjects, queryResponses) {

  for(var m = 0; m < sparqlObjects.length; m++) {
    addNodesToQueryObject(sparqlObjects[m]);
    createHTMLElements(sparqlObjects[m]);
    
    var nextSparqlObject = undefined;
    if(m + 1 < sparqlObjects.length) {
      var nextSparqlObject = sparqlObjects[m+1];
    } 
    createClickSubmitQueryEvent(sparqlObjects[m], nextSparqlObject, queryResponses);
  }
}

function addNodesToQueryObject(sObj) {

  for(var i = 0; i < sObj.originalQuery.length; i++) {
    if(sObj.originalQuery[i] === '[' && sObj.originalQuery[i+1] === '[') {

      var endBracketsFound = false;
      for(var j = i; j < sObj.originalQuery.length; j++) {
        if(sObj.originalQuery[j] === ']' && sObj.originalQuery[j+1] === ']') {
          
          endBracketsFound = true;

          var node = {
            menuSelectorID: undefined, 
            substring: sObj.originalQuery.substring(i, j+2),
            domType: undefined,
            parsedArguments: sObj.originalQuery.substring(i+2, j-1).trim().split(" ")
          };
          
          addMenuSelectorIDAndDomTypeToNode(node);

          sObj.nodes.push(node);
          break;
        } 
      }

      if(!endBracketsFound) {
        console.log("Parse error: no closing brackets found.")
      }
    }
  }
}

function addMenuSelectorIDAndDomTypeToNode(node) {
  
  if(node.parsedArguments[0] === "text") {
    node.menuSelectorID = 'text'+ globalIDCounter;
    node.domType = 'text';

  } else if (node.parsedArguments[0] === "dropdown") {
    node.menuSelectorID = 'dropdown'+ globalIDCounter;
    node.domType = 'dropdown';

  } else if (node.parsedArguments[0] === "radio") {
    node.menuSelectorID = 'radio'+ globalIDCounter;
    node.domType = 'radio';
      
  } else if (node.parsedArguments[0] === "data") {
    node.menuSelectorID = 'data'+ globalIDCounter;
    node.domType = 'data';

  }
  globalIDCounter++;
}

function createHTMLElements(sObj) {
  $(sObj.menuSelector).append('<div class="well" id="' + sObj.menuGroupSelector + '"></div>');
  
  var selector = '#'+sObj.menuGroupSelector;
  $(selector).append('<h4 class="text-center">' + sObj.queryName + '</h4>');

  for(var i = 0; i < sObj.nodes.length; i++) {
    var node = sObj.nodes[i];
    if(node.domType === "text") {

      var placeholder = node.parsedArguments[1];
      var id = node.menuSelectorID;
      $(selector).append('<div class="form-group"><input type="text" class="form-control" id="'+ id +'" placeholder="' + placeholder + '"></div>');

    } else if (node.domType === "dropdown") {
      node.ulID = 'ulSelector'+globalIDCounter;
      node.innerSpanID = 'innerSpan'+globalIDCounter;
      globalIDCounter++;

      var dropdown = '<div class="dropdown" id="'+ node.menuSelectorID +'">';
      dropdown +=      '<button class="btn btn-default dropdown-toggle" type="button" id="'+ node.menuSelectorID +'temp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
      dropdown +=         '<span id='+node.innerSpanID+'>Select an item</span>';
      dropdown +=         '<span class="caret"></span>';
      dropdown +=       '</button>';
      dropdown +=       '<ul class="dropdown-menu" id="'+node.ulID+'" aria-labelledby="'+ node.menuSelectorID +'temp">';

      for(var j = 1; j < node.parsedArguments.length; j++) {
        dropdown += '<li><a>';
        dropdown += node.parsedArguments[j];
        dropdown += '</a></li>';
      }

      dropdown += '</ul></div>';
      $(selector).append(dropdown);

      $('#'+node.ulID).on('click', 'li', function() {
        var liText = $(this).text();
        var closestUL = $(this).closest('ul').attr('id');
        
        // find the correct node to add the data to 
        // otherwise it just adds the data to the last node 
        for(var b = 0; b < sObj.nodes.length; b++) {
          var tempNode = sObj.nodes[b];
          if(tempNode.domType === 'dropdown' && tempNode.ulID == closestUL) {
            tempNode.dataToInsert = liText;
            $('#'+tempNode.innerSpanID).html(liText);
          }
        }
      });

    } else if (node.domType === "radio") {

      var radioGroup = '<div id="'+ node.menuSelectorID +'">';

      radioGroup += '<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="None" checked>None</label></div>';

      for(var j = 1; j < node.parsedArguments.length; j++) {
        radioGroup += '<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="'+node.parsedArguments[j]+'">';
        radioGroup += node.parsedArguments[j];
        radioGroup += '</label></div>';
      }

      radioGroup += '</div>';
      $(selector).append(radioGroup);
        
    } else if (node.domType === "data") {

      node.ulID = 'ulSelector'+globalIDCounter;
      node.innerSpanID = 'innerSpan'+globalIDCounter;
      globalIDCounter++;

      // the li elements for the dropdown menu are populated after 
      // a previous query has been submitted, see the function addDataToDropdown 
      var data = '<div class="dropdown" id="'+ node.menuSelectorID +'">';
      data +=      '<button class="btn btn-default btn-block dropdown-toggle" type="button" id="'+ node.menuSelectorID +'temp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
      data +=        '<div class="row">';
      data +=          '<div class="col-xs-10">';
      data +=            '<span id='+node.innerSpanID+'>Select an item</span></div>';
      data +=          '<div class="col-xs-2">';
      data +=            '<span class="caret"></span></div></div>';
      data +=      '</button>'; 
      data +=      '<ul class="dropdown-menu" id="'+node.ulID+'" aria-labelledby="'+ node.menuSelectorID +'temp"></ul>';
      data +=    '</div>';

      $(selector).append(data);

      $('#'+node.ulID).on('click', 'li', function() {
        var liText = $(this).text();
        var closestUL = $(this).closest('ul').attr('id');
        
        // find the correct node to add the data to 
        // otherwise it just adds the data to the last node 
        for(var b = 0; b < sObj.nodes.length; b++) {
          var tempNode = sObj.nodes[b];
          if(tempNode.domType === 'data' && tempNode.ulID == closestUL) {
            tempNode.dataToInsert = liText;
            $('#'+tempNode.innerSpanID).html(liText);
          }
        }
      });
    }
  }

  $(selector).append('<button class="btn btn-default btn-block" id="'+sObj.submitBtnSelector+'">Submit Query</h3>');
}

function createClickSubmitQueryEvent(currentSparqlObject, nextSparqlObject, queryResponses) {
  // create click event for button
  ( function () { 

    var btn = document.getElementById(currentSparqlObject.submitBtnSelector); 

    btn.addEventListener('click', function() {
      submitQuery(currentSparqlObject, nextSparqlObject, queryResponses);
    }, false);

  }());
}

function addDataToDropdown(sparqlObject, queryResponses) {
  
  // iterate over all of the nodes in the sparql object
  var nodes = sparqlObject.nodes;
  for(var i = 0; i < nodes.length; i++) {
    if (nodes[i].domType === "data") {

      // check that the data node has an associated value in a query response
      for(var j = 0; j < queryResponses.length; j++) {
        var headVars = queryResponses[j].head.vars;
        for(var k = 0; k < headVars.length; k++) {
          if(nodes[i].parsedArguments[1] === headVars[k]) {
            var key = headVars[k];
            var bindings = queryResponses[j].results.bindings;

            // append all of the matching data to the data dropdown menu
            for(var n = 0; n < bindings.length; n++) {
              $('#'+nodes[i].menuSelectorID+'> ul').append('<li><a>' +bindings[n][key].value+ '</a></li>');
            }
          }
        }
      }
    }
  }
}

/////////////////////////////////////////////////////////////////////////////
// The following functions are involved in creating the data tabs ///////////
/////////////////////////////////////////////////////////////////////////////

function removeAllDataTabs(sparqlObjects) {
  for(var i = 0; i < sparqlObjects.length; i++) {
    $('#'+sparqlObjects[i].navListTabID).hide();
  }
}

function addNavTab(sObj, msg) {

  var tabID = 'tabID' + globalIDCounter;
  var codeMirrorAreaID = 'codeMirrorAreaID'+globalIDCounter;
  var navListTab = 'navTabLi'+globalIDCounter;
  globalIDCounter++;

  sObj.navListTabID = navListTab;
  var navULselector = '#navTabUL';
  var navTabPanelDivSelector = '#navTabPanelDiv';

  var navli = '<li id="'+navListTab+'" role="presentation">';
  navli    +=   '<a href="#'+tabID+'" aria-controls="'+tabID+'" role="tab" data-toggle="tab">'+sObj.queryName+'</a>';
  navli    += '</li>';
  $(navULselector).append(navli);

  var navPanel = '<div role="tabpanel" class="tab-pane" id="'+tabID+'">';

  navPanel += '<div class="panel panel-default">';
  navPanel +=   '<div class="panel-heading text-center">'+sObj.queryName+'</div>';
  navPanel +=   '<div class="panel-body">';
  navPanel +=     '<textarea id="'+codeMirrorAreaID+'">'+sObj.codeMirrorQuery+'</textarea>';
  navPanel +=     '<h5 class="text-center">Sparql Endpoint: '+sObj.endpoint+'</h5>';
  navPanel +=   '</div>';
  navPanel +=   '<table class="table">';

  navPanel += '<tr>';
  for(var i = 0; i < msg.head.vars.length; i++) {
    var key = msg.head.vars[i];
    if(key != 'wkt') {
      navPanel += '<th class="text-center">';
      navPanel +=    key;
      navPanel += '</th>';
    }
  }
  navPanel += '</tr>';
  
  for(var i = 0; i < msg.results.bindings.length; i++) {
    navPanel += '<tr>';
    
    var resObject = msg.results.bindings[i];
    for(var j = 0; j < msg.head.vars.length; j++) {
      var column = msg.head.vars[j];
      if(column != 'wkt') {
        if(resObject[column].value.length < 1000) {
          navPanel += '<td>'+resObject[column].value+'</td>';

        } else {
          // Don't show data if there are more than 1000 characters
          navPanel += '<td>Too much data to show</td>';
        }
      }
    }

    navPanel += '</tr>';
  }
  navPanel +=   '</table>';
  navPanel += '</div></div>';
  $(navTabPanelDivSelector).append(navPanel);
  initCodeMirror(codeMirrorAreaID);
}

// must be initialized during tab creation 
// because everything is being built dynamically
var initCodeMirror = function(codeMirrorAreaID) { 
  $('#'+codeMirrorAreaID).each(function() {
    var editor = CodeMirror.fromTextArea($(this).get(0), {
      lineNumbers: true,
      theme: "hopscotch",
      mode: "sparql"
    });
    setTimeout(function() { editor.refresh() },1);
  });
};

//////////////////////////////////////////////////////////////////////////////
// The below functions are involved in submitting the query //////////////////
//////////////////////////////////////////////////////////////////////////////

function baseQueryRequest(endpoint, query, ifSuccessfulDoThis)
{
  var request = $.ajax({
    type: "GET",
    url: endpoint,
    dataType: "json",
    data: {
      "query": query,
      "output": "json"
    }
  });
  
  request.done(ifSuccessfulDoThis);
  
  request.fail(function(jqXHR, textStatus, errorThrown) {
    alert( "Request Failed: " + textStatus);
    alert(errorThrown + ": " + jqXHR.responseText);
  });
}

function removeBracketStatementsFromQueryString(queryString, sparqlObject) {

  for(var j = 0; j < sparqlObject.nodes.length; j++) {
    if(sparqlObject.nodes[j].domType === 'data') {
      queryString = queryString.replace(sparqlObject.nodes[j].substring, sparqlObject.nodes[j].dataToInsert);
    
    } else if(sparqlObject.nodes[j].domType === 'dropdown') {
      queryString = queryString.replace(sparqlObject.nodes[j].substring, sparqlObject.nodes[j].dataToInsert);
    
    } else if(sparqlObject.nodes[j].domType === 'radio') {
      var dataToInsertFromRadioGroup = $('#'+sparqlObject.nodes[j].menuSelectorID+" input:radio:checked").val();
      queryString = queryString.replace(sparqlObject.nodes[j].substring, dataToInsertFromTextBox);

    } else if(sparqlObject.nodes[j].domType === 'text') {
      var dataToInsertFromTextBox = $('#'+sparqlObject.nodes[j].menuSelectorID).val();
      queryString = queryString.replace(sparqlObject.nodes[j].substring, dataToInsertFromTextBox);
    }
  }

  return queryString;
}

// this function replaces the bracket statements in the 
// query that will be displayed on data tabs using code mirrors.
function processCodeMirrorQuery(sparqlObject) {

  var tempQueryString = sparqlObject.queryWithNewlineCharacters;

  tempQueryString = removeBracketStatementsFromQueryString(tempQueryString, sparqlObject);

  sparqlObject.codeMirrorQuery = tempQueryString;
}

function processQueryForSubmission(sparqlObject) {
  
  var tempQueryString = sparqlObject.originalQuery;

  tempQueryString = removeBracketStatementsFromQueryString(tempQueryString, sparqlObject);

  sparqlObject.cleanedQuery = tempQueryString;
}

// used to check if a query response contains wkt data
var contains = function(needle) {
  // Per spec, the way to identify NaN is that it is not equal to itself
  var findNaN = needle !== needle;
  var indexOf;

  if(!findNaN && typeof Array.prototype.indexOf === 'function') {
    indexOf = Array.prototype.indexOf;

  } else {
    indexOf = function(needle) {
      var i = -1, index = -1;
      for(i = 0; i < this.length; i++) {
        var item = this[i];
        if((findNaN && item !== item) || item === needle) {
          index = i;
          break;
        }
      }
      return index;
    };
  }
  return indexOf.call(this, needle) > -1;
};

function submitQuery(currentSparqlObject, nextSparqlObject, queryResponses) {

    processQueryForSubmission(currentSparqlObject);
    processCodeMirrorQuery(currentSparqlObject);

    // Consider using a library like sparqljs to check the syntax of sparql queries
    // before they are submitted in the submitQuery function

    function ifSuccessfulDoThis(msg) { 
      queryResponses.push(msg);
      
      addNavTab(currentSparqlObject, msg);

      if(contains.call(msg.head.vars, 'wkt')) {
        parseFeaturesAndDrawVectors(msg);
      }
      
      if(nextSparqlObject != undefined) {
        addDataToDropdown(nextSparqlObject, queryResponses);
      } 
    }

    baseQueryRequest(currentSparqlObject.endpoint, currentSparqlObject.cleanedQuery, ifSuccessfulDoThis);
}