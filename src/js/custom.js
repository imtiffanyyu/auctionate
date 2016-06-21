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

		var displayitemid = $("#displayitemid").text();
		console.log(displayitemid);

		var elink   = $(this).prev(".editlink"); // looks for "editlink" before savebtn
		var dataset = elink.prev(".datainfo"); // looks for "datainfo" before editlink
		var newid   = dataset.attr("id"); // grabs id for form creaton
		var cinput  = "#"+newid+"-form"; // creates form for the id
		var einput  = $(cinput); // 

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
				newValue: newval,
				displayitemid: displayitemid
			}
		})
	});

	$("tr").click(function() {
		var clickeditem = $(".itemid", this).text() // looking for itemid in the context of this (the thing I clicked)
		console.log("You clicked item " + clickeditem)

		$.ajax({
			method: "GET",
			url: "/itemjson",
			data: {
				clickeditem: clickeditem
			}
		}).done(function(item){
			console.log(item)
			$('#displayitemid').text (item.id)
			$('#lotnumber').text (item.lotnumber)
			$('#name').text (item.name)
			$('#category').text (item.category)
			$('#description').text (item.description)
			$('#estimatelow').text (item.estimatelow)
			$('#estimatehigh').text (item.estimatehigh)
			$('#reserve').text (item.reserve)
			$('#consignorId').text (item.consignorId)
		})

	})

	$(".deleteitem").click(function() {
		var deleteitemid = $("#displayitemid").text();
		console.log(deleteitemid);

		$.ajax({
			method: "DELETE",
			url: "/item",
			data: {
				deleteitemid: deleteitemid
			}
		})
	})

});
