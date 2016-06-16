$(document).ready(function(){
<<<<<<< HEAD
	$('.collapsible').collapsible();
	$(".dropdown-button").dropdown({ beloworigin: true });

	$('button[name=updateid]').on('click', function(e){
		e.preventDefault()
		console.log('Button clicked!')
		$.ajax({
		method: "POST"
	})
	})
=======
  $('.collapsible').collapsible();
  $(".dropdown-button").dropdown({ beloworigin: true });
  $('.modal-trigger').leanModal();
>>>>>>> 9f0205321d8678686a415a70d1feb9ecf338e64e
});
