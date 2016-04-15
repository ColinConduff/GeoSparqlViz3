

function parseQueryIntoArray(query) {
    var tempArray = [];

    for(var i = 0; i < query.length; i++)
    {
        if(query[i] === '[' && query[i+1] === '[') {
            // console.log("Start brackets");

            var endBracketsFound = false;
            for(var j = i; j < query.length; j++) {
                if(query[j] === ']' && query[j+1] === ']') {
                    
                    endBracketsFound = true;

                    tempArray.push(query.substring(i+2, j-1).trim().split(" "));
                    // console.log("array: ");
                    // console.log(array);

                    // console.log("End brackets");
                    break;
                } 
            }

            if(!endBracketsFound) {
                console.log("Parse error: no closing brackets found.")
            }
        }
    }

    return tempArray;
}

var globalIDCounter = 0;
function buildMenu(name, query, selector, queryResponse) {
    
    console.log(name);
    console.log(query);

    var parsedQueryArray = parseQueryIntoArray(query);

    console.log(parsedQueryArray);

    var menuSelectorIDs = [];

    $(selector).append('<h3>' + name + '</h3>');

    for(var i = 0; i < parsedQueryArray.length; i++) {
        if(parsedQueryArray[i][0] === "text") {
            console.log("text");
            
            var tempMenuSelector = 'text'+ globalIDCounter;
            globalIDCounter++;
            menuSelectorIDs.push(tempMenuSelector);

            $(selector).append('<div class="form-inline"><div class="form-group"><input type="text" class="form-control" id="'+ tempMenuSelector +'" placeholder="' + parsedQueryArray[i][1] + '"></div></div>');

        } else if (parsedQueryArray[i][0] === "dropdown") {
            console.log("dropdown");
            
            var tempMenuSelector = 'dropdownMenu'+ globalIDCounter;
            globalIDCounter++;
            menuSelectorIDs.push(tempMenuSelector);

            var dropdown = '<div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="'+ tempMenuSelector +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Dropdown<span class="caret"></span></button><ul class="dropdown-menu" aria-labelledby="'+ tempMenuSelector +'">';

            for(var j = 1; j < parsedQueryArray[i].length; j++) {
                dropdown += '<li><a>';
                dropdown += parsedQueryArray[i][j];
                dropdown += '</a></li>';
            }

            dropdown += '</ul></div>';
            $(selector).append(dropdown);

        } else if (parsedQueryArray[i][0] === "radio") {
            console.log("radio");

            var tempMenuSelector = 'radioGroup'+ globalIDCounter;
            globalIDCounter++;
            menuSelectorIDs.push(tempMenuSelector);

            var radioGroup = '<div class="'+ tempMenuSelector +'">';

            radioGroup += '<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>None</label></div>';

            for(var j = 1; j < parsedQueryArray[i].length; j++) {
                radioGroup += '<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1">';
                radioGroup += parsedQueryArray[i][j];
                radioGroup += '</label></div>';
            }

            radioGroup += '</div>';
            $(selector).append(radioGroup);
            
        } else if (parsedQueryArray[i][0] === "data") {
            console.log("data");

            var dataFromPreviousQuery = parsedQueryArray[i][1];

            if(queryResponse.indexOf(dataFromPreviousQuery) != -1) {
                
            
            } else {
                console.log("Data " + dataFromPreviousQuery + " not found in a response from a previous query!");
            }
            
            // get data from an earlier query

            // var tempMenuSelector = 'dataMenu'+ globalIDCounter;
            // globalIDCounter++;
            // menuSelectorIDs.push(tempMenuSelector);

            // var data = '<div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="'+ tempMenuSelector +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Dropdown<span class="caret"></span></button><ul class="dropdown-menu" aria-labelledby="'+ tempMenuSelector +'">';

            // for(var j = 1; j < .length; j++) {
            //     data += '<li><a>';
            //     data += [j];
            //     data += '</a></li>';
            // }

            // data += '</ul></div>';
            // $(selector).append(data);
        }
    }
}

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

function submitQuery(query, endpoint) {
    
    function ifSuccessfulDoThis(msg) { 
        parseFeaturesAndDrawVectors(msg);
        // build next menu
    }

    baseQueryRequest(endpoint, query, ifSuccessfulDoThis);
}