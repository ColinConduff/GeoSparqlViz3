
$('document').ready(function() {

  	$('#currentUserSearchByName').keyup(function(){
	    var valThis = $(this).val().toLowerCase();
	    
	    if(valThis == ""){
	        $('#currentUserQueryData #currentUserQueryRow').show();           
	    
	    } else {
	        $('#currentUserQueryData #currentUserQueryRow').each(function(){
	            var text = $(this).text().toLowerCase();
	            (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
	        });
	    };
    });

    $('#otherUserSearchByName').keyup(function(){
	    var valThis = $(this).val().toLowerCase();

	    if(valThis == ""){
	        $('#otherUsersQueryData #otherUsersQueryRow').show();           
	    
	    } else {
	        $('#otherUsersQueryData #otherUsersQueryRow').each(function(){
	            var text = $(this).find('#queryName').text().toLowerCase();
	            (text.indexOf(valThis) > -1) ? $(this).show() : $(this).hide();
	        });
	    };
    });

	$('#otherUserSearchByEmail').keyup(function() { 
		var valThis = $(this).val().toLowerCase();
        $("#otherUsersQueryData #userEmail:contains('" + valThis + "')").closest('#otherUsersQueryRow').show();
        $("#otherUsersQueryData #userEmail:not(:contains('" + valThis + "'))").closest('#otherUsersQueryRow').hide();
    });

    $('#notLoggedInSearchByName').keyup(function(){
	    var valThis = $(this).val().toLowerCase();

	    if(valThis == ""){
	        $('#notLoggedInQueryData #notLoggedInQueryRow').show();           
	    
	    } else {
	        $('#notLoggedInQueryData #notLoggedInQueryRow').each(function(){
	            var text = $(this).find('#queryName').text().toLowerCase();
	            (text.indexOf(valThis) > -1) ? $(this).show() : $(this).hide();
	        });
	    };
    });

	$('#notLoggedInSearchByEmail').keyup(function() { 
		var valThis = $(this).val().toLowerCase();
        $("#notLoggedInQueryData #userEmail:contains('" + valThis + "')").closest('#notLoggedInQueryRow').show();
        $("#notLoggedInQueryData #userEmail:not(:contains('" + valThis + "'))").closest('#notLoggedInQueryRow').hide();
    });
});