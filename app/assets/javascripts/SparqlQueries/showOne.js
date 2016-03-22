$('document').ready(function() {    
    //var endpoint = '<%#= j @sparql_query.endpoint %>';
    //var query = '<%= j @sparql_query.query.squish.html_safe %>';

    //console.log(endpoint);
    //console.log(query);
    //submitquery(endpoint, query); 

    $("textarea").each(function() {
      CodeMirror.fromTextArea($(this).get(0), {
        lineNumbers: false,
        theme: "hopscotch",
        mode: "sparql",
        lineWrapping: true
      });
    });
});