const {
    GLOBAL_SALT
} = process.env
const md5 = require('md5')
const ev = require("express-validator");
//const jwt = require('jsonwebtoken');


class Authen {




    static checkToken(req, res, next) {
        try {
            
            next()

        } catch (e) {
            return res.status(500).send("Internal Server Error!");

        };
    };

}

module.exports = Authen