var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
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
	estimate: Sequelize.INTEGER,
	reserve: Sequelize.INTEGER,
	premium: Sequelize.INTEGER
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
	zipcode: Sequelize.STRING,
	city: Sequelize.STRING,
	payment: Sequelize.TEXT,
	shipping: Sequelize.TEXT
});

// assigns consignors to items
Consignor.hasMany(Item);
Item.belongsTo(Consignor);

// assigns items to bidder -- FIX THIS
// Bidder.hasMany(Item);
// Item.belongsTo(Bidder);

var app = express();

app.use(express.static('./src/'));
app.use(bodyParser.urlencoded({extended: true}));

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

// gets all the itmes in the database
app.get('/item', function (req, res) {
	Item.findAll().then(function (items) {
		items = items.map(function (itemRow) {
			var columns = itemRow.dataValues;
			return {
				lotnumber: columns.lotnumber,
				name: columns.name,
				category: columns.category,
				description: columns.description,
				estimate: columns.estimate,
				reserve: columns.reserve,
				premium: columns.premium
			}
		});
		res.render('item', {
			items: items
		});
	});
});

app.post('/item', function (req, res) {
	Item.create({
		lotnumber: req.body.lotnumber,
		name: req.body.name,
		category: req.body.catergory,
		description: req.body.description,
		estimate: req.body.estimate,
		reserve: req.body.reserve,
		premium: req.body.premium
	});
	res.redirect('back') // back says" stay on this page
});

// gets all the consignors from the database
app.get('/consignor', function (req, res) {
	Consignor.findAll().then(function (consignors) {
		consignors = consignors.map(function (consignorRow) {
			var columns = consignorRow.dataValues;
			return {
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


// form to add new bidder
app.get('/bidder', function (req, res) {
	res.render('bidder');
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

sequelize.sync({force: true}).then(function () {
	var server = app.listen(3000, function () {
		console.log('Auctionate app listening on port: ' + server.address().port);
	});
});
