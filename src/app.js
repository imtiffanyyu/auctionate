var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

// connect to the database
var sequelize = new Sequelize('auctionate', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

//create table called items
var Item = sequelize.define('item', {
	name: Sequelize.STRING,
	category: Sequelize.STRING,
	description: Sequelize.TEXT
});