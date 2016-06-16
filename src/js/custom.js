$(document).ready(function(){

	$('.collapsible').collapsible();
	$(".dropdown-button").dropdown({ beloworigin: true });
	$('.modal-trigger').leanModal();
	
	$(".editlink").on("click", function(e){
	  e.preventDefault();
		var dataset = $(this).prev(".datainfo");
		var savebtn = $(this).next(".savebtn");
		var theid   = dataset.attr("id");
		var newid   = theid+"-form";
		var currval = dataset.text();
		
		dataset.empty();
		
		$('<input type="text" name="'+newid+'" id="'+newid+'" value="'+currval+'" class="hlite">').appendTo(dataset);
		
		$(this).css("display", "none");
		savebtn.css("display", "block");
	});
	$(".savebtn").on("click", function(e){
		e.preventDefault();
		var elink   = $(this).prev(".editlink"); // looks for "editlink" before savebtn
		var dataset = elink.prev(".datainfo"); // looks for "datainfo" before editlink
		var newid   = dataset.attr("id"); // grabs id for form creaton
		var cinput  = "#"+newid+"-form"; // creates form for the id
		var einput  = $(cinput); // 
		console.log(einput)
		var newval  = einput.val(); 
		console.log('form value is: ' + newval)
		$(this).css("display", "none");
		einput.remove();
		dataset.html(newval); // Supposed to update the values
		elink.css("display", "block");


		$.ajax({
		  	method: "PUT",
			url: "/item",
			data: { 
				newid: newid,
				newValue: newval
			}
		})
	});

	
});
