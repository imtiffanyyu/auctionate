var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('express-favicon');
var	formidable = require ('formidable');
var util = require('util');
var fs = require('fs-extra');
var qt = require('quickthumb');
//var jquery = require('jquery');

// connect to the database
var sequelize = new Sequelize('auctionate', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

// create table called items
var Item = sequelize.define('item', {
	lotnumber: Sequelize.INTEGER,
	name: Sequelize.STRING,
	category: Sequelize.STRING,
	description: Sequelize.TEXT,
	estimatelow: Sequelize.INTEGER,
	estimatehigh: Sequelize.INTEGER,
	reserve: Sequelize.INTEGER
});

// create table called consignors
var Consignor = sequelize.define('consignor', {
	firstname: Sequelize.STRING,
	lastname: Sequelize.STRING,
	address: Sequelize.STRING,
	zipcode: Sequelize.STRING,
	city: Sequelize.STRING,
	country: Sequelize.STRING,
	phone: Sequelize.STRING,
	email: Sequelize.STRING,
	bankaccount: Sequelize.INTEGER,
	commission: Sequelize.INTEGER,
	fee: Sequelize.INTEGER
});

// create table called bidders
var Bidder = sequelize.define('bidder', {
	firstname: Sequelize.STRING,
	lastname: Sequelize.STRING,
	phone: Sequelize.STRING,
	email: Sequelize.STRING,
	address: Sequelize.STRING,
	country: Sequelize.STRING,
	zipcode: Sequelize.STRING,
	city: Sequelize.STRING,
	payment: Sequelize.TEXT,
	shipping: Sequelize.TEXT
});

// assigns consignors to items
Consignor.hasMany(Item);
Item.belongsTo(Consignor);

// assigns items to bidder
Bidder.hasMany(Item);
Item.belongsTo(Bidder);

var app = express();
app.locals.moment = require('moment');

app.use(qt.static(__dirname + './src/'));
app.use(express.static('./src/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon('./src/img/favicon.ico'));

// app.post('/upload', function (req, res){
// 	var form = new formidable.IncomingForm();
// 	form.parse(req, function(err, fields, files) {
// 		res.writeHead(200, {'content-type': 'text/plain'});
// 		res.write('received upload:\n\n');
// 		res.end(util.inspect({fields: fields, files: files}));
// 	});

// 	form.on('end', function(fields, files) {
// 		/* temporary location of our uploaded file */
// 		var temp_path = this.openedFiles[0].path;
// 		/* the file name of the uploaded file */
// 		var file_name = this.openedFiles[0].name;
// 		 location where we want to copy the uploaded file 
// 		var new_location = 'uploads/';

// 		fs.copy(temp_path, new_location + file_name, function(err) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("success!")
// 			}
// 		});
// 	});
// });


// app.get('/image', function (req, res){
//   res.writeHead(200, {'Content-Type': 'text/html' });
//   var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
//   res.end(form); 
// }); 


app.post('/item1', function (req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log(err)
	});
		
	form.on('end', function(fields, files) {
		/* temporary location of our uploaded file */
		var temp_path = this.openedFiles[0].path;
		/* the file name of the uploaded file */
		var file_name = this.openedFiles[0].name;
		/* location where we want to copy the uploaded file */
		var new_location = 'uploads/';

		fs.copy(temp_path, new_location + file_name, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("success!")
			}
		});
		res.redirect('back')
	});
});


app.use(session({
	secret: 'oh wow very secret much security',
	resave: true,
	saveUninitialized: false
}));

app.set('views', './src/views');
app.set('view engine', 'jade');

// HOME VIEW
app.get('/', function (req, res) {
	res.render('index');
});



// Invoice view for consignors
app.get('/invoiceconsignor', function (req, res) {
	console.log(req.query.consignor);
	Consignor.findOne({
		where: {id: req.query.consignor},
		include: [Item]
	}).then (function (details) {
		var data = details
		
		res.render('invoiceconsignor', {
			consignorId: req.query.consignor,
			data: data
	});
	})

});

// Invoice view for bidders
app.get('/invoicebidder', function (req, res) {
	console.log(req.query.bidder);
	Bidder.findOne({
		where: {id: req.query.bidder},
		include: [Item]
	}).then (function (details) {
		var data = details;

		res.render('invoicebidder', {
			bidderId: req.query.bidder,
			data: data
		});

	})
	
});

// gets all the items in the database
app.get('/item', function (req, res) {

	Item.findAll().then(function (items) {
		items = items.map(function (itemRow) {
			var columns = itemRow.dataValues;
			return {
				itemid: columns.id,
				lotnumber: columns.lotnumber,
				name: columns.name,
				category: columns.category,
				description: columns.description,
				estimatelow: columns.estimatelow,
				estimatehigh: columns.estimatehigh,
				reserve: columns.reserve,
				consignorId: columns.consignorId
			}

		});
		res.render('item', {
			items: items
		});

	});
});

//create item in the database
app.post('/item', function (req, res) {
	Item.create({
		lotnumber: req.body.lotnumber,
		name: req.body.name,
		category: req.body.category,
		description: req.body.description,
		estimatelow: req.body.estimatelow,
		estimatehigh: req.body.estimatehigh,
		reserve: req.body.reserve,
		consignorId: req.body.consignorId
	});
	res.redirect('back') // back says" stay on this page
});

app.get('/itemjson', function (req, res) {
	Item.findById(req.query.clickeditem).then(function (clickeditems) {
		res.send(clickeditems);
	})
})

// delete item in the database
app.delete('/item', function (req, res) {
	Item.destroy({
		where:
		{
			id: req.body.deleteitemid
		}},
		function (err, res) {
			if (err) return res.send(500, err)
				res.send('Item deleted')
		})
})

// update item in the database
app.put('/item', function (req, res) {
	Item.findById(req.body.displayitemid).then(function (item) {
		var object = {};
		object[req.body.newid] = req.body.newValue;
		console.log(object);
		item.updateAttributes(object).then(function () {
		res.send({status: 'update worked'})
		})
	})
})

// gets all the consignors from the database
app.get('/consignor', function (req, res) {
	Consignor.findAll().then(function (consignors) {
		consignors = consignors.map(function (consignorRow) {
			var columns = consignorRow.dataValues;
			return {
				id: columns.id,
				firstname: columns.firstname,
				lastname: columns.lastname,
				address: columns.address,
				zipcode: columns.zipcode,
				city: columns.city,
				country: columns.country,
				phone: columns.phone,
				email: columns.email,
				bankaccount: columns.bankaccount,
				commission: columns.commission,
				fee: columns.fee
			}
		});
		res.render('consignor', {
			consignors: consignors
		});
	});
});

app.get('/consignorjson', function (req, res) {
	Consignor.findById(req.query.clickedconsignor).then(function (clickedconsignors) {
		res.send(clickedconsignors);
	})
})

// add new consignor
app.post('/consignor', function (req, res) {
	Consignor.create({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		address: req.body.address,
		zipcode: req.body.zipcode,
		city: req.body.city,
		country: req.body.country,
		phone: req.body.phone,
		email: req.body.email,
		bankaccount: req.body.bankaccount,
		commission: req.body.commission,
		fee: req.body.fee
	}).then(function(){
	res.redirect('back') // back says: stay on this page
	})
});

// delete consignor from the database
// app.delete('/item', function (req, res) {
// 	Item.destroy({
// 		where:
// 		{
// 			id: req.body.deleteitemid
// 		}},
// 		function (err, res) {
// 			if (err) return res.send(500, err)
// 				res.send('Item deleted')
// 		})
// })

// update consignor in the database
// app.put('/item', function (req, res) {
// 	Item.findById(req.body.displayitemid).then(function (item) {
// 		var object = {};
// 		object[req.body.newid] = req.body.newValue;
// 		console.log(object);
// 		item.updateAttributes(object).then(function () {
// 		res.send({status: 'update worked'})
// 		})
// 	})
// })

// get all bidders out of the database
app.get('/bidder', function (req, res) {
	Bidder.findAll().then(function (bidders) {
		bidders = bidders.map(function (bidderRow) {
			var columns = bidderRow.dataValues;
			return {
				firstname: columns.firstname,
				lastname: columns.lastname,
				phone: columns.phone,
				email: columns.email,
				address: columns.address,
				zipcode: columns.zipcode,
				city: columns.city,
				payment: columns.payment,
				shipping: columns.shipping,
				bidderId: columns.bidderId
			}
		});
		res.render('bidder', {
			bidders: bidders
		});
	});
});

app.post('/bidder', function (req, res) {
	Bidder.create({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		phone: req.body.phone,
		email: req.body.email,
		address: req.body.address,
		zipcode: req.body.zipcode,
		city: req.body.city,
		payment: req.body.payment,
		shipping: req.body.shipping
	});
	res.redirect('back') // back says: stay on this page
});

sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		console.log('Auctionate app listening on port: ' + server.address().port);
	});
});
