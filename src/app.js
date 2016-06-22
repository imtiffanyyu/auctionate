var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('express-favicon');
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

app.use(express.static('./src/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon('./src/img/favicon.ico'));

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

	req.query.consignor
	res.render('invoiceconsignor', {

	});

	console.log(req.query.consignor);
	Consignor.findOne({
		where: {id: req.query.consignor},
		include: [Item]
	}).then (function (details) {
		var data = details

		console.log(details.commission)
		console.log(details.fee)
		
		// var data = details.map(function (detail) {
		// 	return {
		// 		id: detail.item.id,
		// 		name: detail.item.name,
		// 		reserve: detail.item.reserve,
		// 		firstname: detail.firstname,
		// 		lastname: detail.lastname,
		// 		address: detail.address,
		// 		zipcode: detail.zipcode,
		// 		city: detail.city,
		// 		country: detail.country,
		// 		phone: detail.phone,
		// 		email: detail.email,
		// 		bankaccount: detail.bankaccount,
		// 		commission: detail.commission,
		// 		fee: detail.consignorfee
		// 	};
		// })
	res.render('invoiceconsignor', {
		consignorId: req.query.consignor,
		data: data
	});
	})

});

// Invoice view for consignors
app.get('/invoicebidder', function (req, res) {
	res.render('invoicebidder');
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
			// itemtoview: data
		});

	});
});

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
