
// custom code for pagination for index.html.erb
// borrowed from here: http://stackoverflow.com/questions/20896076/how-to-use-simplepagination-jquery
// mind the slight change below, personal idea of best practices
var customPagination = function(items, numItems, perPage, selector) {
    // consider adding an id to your table,
    // just incase a second table ever enters the picture..?

    // only show the first 2 (or "first per_page") items initially
    items.slice(perPage).hide();

    // now setup your pagination
    // you need that .pagination-page div before/after your table
    $(selector).pagination({
        items: numItems,
        itemsOnPage: perPage,
        onPageClick: function(pageNumber) { // this is where the magic happens
            // someone changed page, lets hide/show trs appropriately
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;

            items.hide() // first hide everything, then show for the new page
                 .slice(showFrom, showTo).show();
        }
    });

    // EDIT: extra stuff to cover url fragments (i.e. #page-3)
    // https://github.com/bilalakil/bin/tree/master/simplepagination/page-fragment
    // is more thoroughly commented (to explain the regular expression)

    // we'll create a function to check the url fragment and change page
    // we're storing this function in a variable so we can reuse it
    var checkFragment = function() {
        // if there's no hash, make sure we go to page 1
        var hash = window.location.hash || "#page-1";

        // we'll use regex to check the hash string
        hash = hash.match(/^#page-(\d+)$/);

        if(hash)
            // the selectPage function is described in the documentation
            // we've captured the page number in a regex group: (\d+)
            $("#pagination").pagination("selectPage", parseInt(hash[1]));
    };

    // we'll call this function whenever the back/forward is pressed
    $(window).bind("popstate", checkFragment);

    // and we'll also call it to check right now!
    checkFragment();

};

$('document').ready(function() {
  // filter for search bar

  $('#searchBar').keyup(function(){
    var valThis = $(this).val().toLowerCase();
    if(valThis == ""){
        $('#userQueryData #queryRow').show();           
    } else {
        $('#userQueryData #queryRow').each(function(){
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
        });
      };
    });

  // sort by update time

  var starBtnClicked = true;

  $('#starBtn').click(function () {

    jQuery.fn.sortDomElements = (function() {
      return function(comparator) {
          return Array.prototype.sort.call(this, comparator).each(function(i) {
                this.parentNode.appendChild(this);
          });
      };
    })();

    $("#userQueryData").children().sortDomElements(function(a,b){
      akey = $(a).attr("updateTime");
      bkey = $(b).attr("updateTime");

      if(starBtnClicked) {

        if (akey == bkey) return 0;
        if (akey < bkey) return -1;
        if (akey > bkey) return 1;

      } else {
        
        if (akey == bkey) return 0;
        if (akey > bkey) return -1;
        if (akey < bkey) return 1;

      }
    })

    starBtnClicked = !starBtnClicked;
  });

  // set up pagination 

  var items = $("#userQueryData #queryRow");
  var numItems = items.length;
  var perPage = 10;
  var selector = "#pagination1";

  customPagination(items, numItems, perPage, selector);

  ///////////////////////////////////////////////////////////////////////////////

  // filter for search bar

  $('#searchBar').keyup(function(){
    var valThis = $(this).val().toLowerCase();
    if(valThis == ""){
        $('#allQueryData #queryRow').show();           
    } else {
        $('#allQueryData #queryRow').each(function(){
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
        });
      };
    });

  // sort by update time

  var starBtnClicked = true;

  $('#starBtn').click(function () {

    jQuery.fn.sortDomElements = (function() {
      return function(comparator) {
          return Array.prototype.sort.call(this, comparator).each(function(i) {
                this.parentNode.appendChild(this);
          });
      };
    })();

    $("#allQueryData").children().sortDomElements(function(a,b){
      akey = $(a).attr("updateTime");
      bkey = $(b).attr("updateTime");

      if(starBtnClicked) {

        if (akey == bkey) return 0;
        if (akey < bkey) return -1;
        if (akey > bkey) return 1;

      } else {
        
        if (akey == bkey) return 0;
        if (akey > bkey) return -1;
        if (akey < bkey) return 1;

      }
    })

    starBtnClicked = !starBtnClicked;
  });

  // set up pagination 

  var items = $("#allQueryData #queryRow");
  var numItems = items.length;
  var perPage = 10;
  var selector = "#pagination2";

  customPagination(items, numItems, perPage, selector);

});