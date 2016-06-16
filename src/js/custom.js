$(document).ready(function(){
	$('.collapsible').collapsible();
	$(".dropdown-button").dropdown({ beloworigin: true });

	$('button[name=updateid]').on('click', function(e){
		e.preventDefault()
		console.log('Button clicked!')
		$.ajax({
		method: "POST"
	})
	})
});
