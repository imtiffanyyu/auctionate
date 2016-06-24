$(document).ready(function(){

	var alldata = $('.finalprice')
	var total = 0
	for (var i = 0; i < alldata.length; i++) {
		total += parseFloat( $(alldata[i]).text() )
	}

	$('#totalamount').text( total - $('#adminfee').text() )

	$('.collapsible').collapsible();
	$(".dropdown-button").dropdown({ beloworigin: true });
	$('.modal-trigger').leanModal();

	// $("#consignors").dataTable( {
	// 	"lengthChange": false
	// });
	// $("#items").dataTable( {
	// 	"lengthChange": false
	// });
//////////////////////////////////////////////////////////////////////

$("button#editconsignor").click(function() {
	$("#editconsignorform").fadeIn('slow');
})

$("button#addconsignor").click(function() {
	$("#consignorform").fadeIn('slow');
})

$("a#canceladdconsignor").click(function() {
	$("#consignorform").fadeOut('slow');
})

$("button#additem").click(function() {
	$("#editlotform").fadeOut('slow');
	$("#itemform").fadeIn('slow');
})

$("a#canceladditem").click(function() {
	$("#itemform").fadeOut('slow');
})

$(".editconsignor").click(function() {
	$("#editconsignorform").fadeIn('slow');

		var clickedconsignor = $(".clickedconsignorid", this).text() // looking for clickedconsignorid in the context of this (the thing I clicked)
		console.log("You clicked consignor " + clickedconsignor)

		$.ajax({
			method: "GET",
			url: "/consignorjson",
			data: {
				clickedconsignor: clickedconsignor
			}
		}).done(function(consignor){
			console.log(consignor)
			//$('#displayconsignorid').text (consignor.id)
			$('#firstname').text (consignor.firstname)
			$('#lastname').text (consignor.lastname)
			$('#address').text (consignor.address)
			$('#zipcode').text (consignor.zipcode)
			$('#city').text (consignor.city)
			$('#country').text (consignor.country)
			$('#phone').text (consignor.phone)
			$('#email').text (consignor.email)
			$('#bankaccount').text (consignor.bankaccount)
			$('#commission').text (consignor.commission)
			$('#fee').text (consignor.fee)
		})


	$("button#additem").click(function() {
		$("#editlotform").fadeOut('slow');
		$("#itemform").fadeIn('slow');
		$("#canceladditem").fadeIn('slow');
	})

	$("a#canceladditem").click(function() {
		$("#itemform").fadeOut('slow');
		$("#editlotform").fadeOut('slow');
		$("#canceladditem").fadeOut('slow')
	})

$("button#addconsignor").click(function() {
	$("#consignorform").fadeIn('slow');
})

$("a#canceladdconsignor").click(function() {
	$("#consignorform").fadeOut('slow');
})

$("button#additem").click(function() {
	$("#editlotform").fadeOut('slow');
	$("#itemform").fadeIn('slow');
})

$("a#canceladditem").click(function() {
	$("#itemform").fadeOut('slow');
})
 //master
////////////////////////////////////////////////////////////////
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
		var einput  = $(cinput);
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
	$("#itemform").fadeOut('slow');
	$("#editlotform").fadeIn('slow');
	$(".itemclicked").click(function() {
		$("#itemform").fadeOut('slow');
		$("#editlotform").fadeIn('slow');
		$("#canceladditem").fadeIn('slow');

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


$('#createlot').on('click', function(event) {
		event.preventDefault();

	// New lot
	$.post(
		'/item',{
			consignorId: $('[name="consignorId"]').val(),
			lotnumber: $('[name="lotnumber"]').val(),
			name: $('[name="name"]').val(),
			category: $('[name="category"]').val(),
			description: $('[name="description"]').val(),
			estimatelow: $('[name="estimatelow"]').val(),
			estimatehigh: $('[name="estimatehigh"]').val(),
			reserve: $('[name="reserve"]').val(),

		}, function(result){ console.log(result) }
		)
	// End new lot

	// File upload
	var data = new FormData();
	$.each($('[name="upload"]')[0].files, function(i, file) {
		data.append('file-'+i, file);
	});
	$.ajax({
		url: '/item1',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(data){
		}
	});
	// End file upload

});
	$('#createbidder').on('click', function(event) {
		event.preventDefault();

	$.post(
		'/bidder',{
			firstname: $('[name="firstname"]').val(),
			lastname: $('[name="lastname"]').val(),
			phone: $('[name="phone"]').val(),
			email: $('[name="email"]').val(),
			address: $('[name="address"]').val(),
			zipcode: $('[name="zipcode"]').val(),
			city: $('[name="country"]').val(),
			payment: $('[name="consignorId"]').val()
		}, function(result){ console.log(result) }
		)
	$.ajax({
		url: '/bidder',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(data){
		}
	});
});

});

	$('#createlot').on('click', function(event) {
		event.preventDefault();

	// New lot
	$.post(
		'/item',{
			consignorId: $('[name="consignorId"]').val(),
			lotnumber: $('[name="lotnumber"]').val(),
			name: $('[name="name"]').val(),
			category: $('[name="category"]').val(),
			description: $('[name="description"]').val(),
			estimatelow: $('[name="estimatelow"]').val(),
			estimatehigh: $('[name="estimatehigh"]').val(),
			reserve: $('[name="reserve"]').val(),

		}, function(result){ console.log(result) }
		)
	// End new lot

	// File upload
	var data = new FormData();
	$.each($('[name="upload"]')[0].files, function(i, file) {
		data.append('file-'+i, file);
	});
	$.ajax({
		url: '/item1',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(data){
		}
	});
	// End file upload

});
	$('#createbidder').on('click', function(event) {
		event.preventDefault();

	$.post(
		'/bidder',{
			firstname: $('[name="firstname"]').val(),
			lastname: $('[name="lastname"]').val(),
			phone: $('[name="phone"]').val(),
			email: $('[name="email"]').val(),
			address: $('[name="address"]').val(),
			zipcode: $('[name="zipcode"]').val(),
			city: $('[name="country"]').val(),
			payment: $('[name="consignorId"]').val()
		}, function(result){ console.log(result) }
		)
	$.ajax({
		url: '/bidder',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(data){
		}
	});
});
});
