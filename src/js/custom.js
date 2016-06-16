$(document).ready(function(){
	$('.collapsible').collapsible();
	$(".dropdown-button").dropdown({ beloworigin: true });

	$('button[name=updateid]').ajax({
		method: "PUT",
	})
		.done(function( msg ) {
		alert( "Data Updated: " + msg );
		});
});
