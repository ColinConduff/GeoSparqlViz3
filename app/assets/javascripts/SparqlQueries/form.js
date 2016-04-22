var initForm = function() { 
    $("textarea").each(function() {
      var editor = CodeMirror.fromTextArea($(this).get(0), {
        lineNumbers: true,
        theme: "hopscotch",
        mode: "sparql"
      });
      setTimeout(function() { editor.refresh() },1);
    });
};
$(document).ready(initForm);
$(document).on('page:load', initForm);