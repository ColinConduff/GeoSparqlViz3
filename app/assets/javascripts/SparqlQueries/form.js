$('document').ready(function() {

	function initializeSelectPicker() {
		$('.selectpicker').selectpicker({width: '100%', liveSearch: true});
	}

	$.when(initializeSelectPicker()).done( function () {
		//$('#parentQueryMenu').append("<option>http://www.lotico.com:3030/lotico/sparql</option>");
		$('#parentQueryMenu').selectpicker('refresh');
	});
	
});