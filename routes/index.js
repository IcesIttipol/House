const route = require('express').Router();
const Authen = require('../Middleware/Authen');
const ex = require("express-validator");
const House = require('../Controllers/http/HouseControllers');
//POST
route.post('/home', [
    ex.body("name").notEmpty(),
    ex.body("desc").notEmpty(),
    ex.body("price").notEmpty(),
    ex.body("post_code").notEmpty(),
], /* Authen.checkToken, */ House.CreateHouse);


//GET
route.get('/home', [
    ex.query("skip").notEmpty(),
    ex.query("take").notEmpty()
], /* Authen.checkToken, */ House.GetHouses);

route.get('/postCode', /* Authen.checkToken, */ House.GetPostcodes);
route.get('/postCode/:id', /* Authen.checkToken, */ House.GetPostcode);

module.exports = route