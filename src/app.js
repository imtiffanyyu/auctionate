var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

// connect to the database
<<<<<<< HEAD
var sequelize = new Sequelize('auctionate', 'postgres', 12345, {
=======
var sequelize = new Sequelize('auctionate', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
>>>>>>> nav
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
	lastname: Sequelize.STRING,
	address: Sequelize.STRING,
	zipcode: Sequelize.INTEGER,
	city: Sequelize.STRING,
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
	zipcode: Sequelize.INTEGER,
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

// form to add new item
app.get('/item', function (req, res) {
	res.render('item');
});

// form to add new consignor
app.get('/consignor', function (req, res) {
	res.render('consignor');
});

// form to add new bidder
app.get('/bidder', function (req, res) {
	res.render('bidder');
});

sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		console.log('Auctionate app listening on port: ' + server.address().port);
	});
});
