/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require("sqlstring");
const { HttpResponse } = require("../services/http-response");
const { log } = require("../services/log");
const { sync } = require("load-json-file");

module.exports = {
    addProductToCart: async (req, res) => {
        let response;
        let category = req.body.category;
        try {
            let sql = sqlString.format("select * DISTINCT name from product where category = ?", [category]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            log(data["rows"]);
            
            response = new HttpResponse(
                "Change Info Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    viewCart: async (req, res) => {
        let response;
        let name = req.body.name;
        try {
            let x = `%${name}%`
            let sql = sqlString.format("select * from product where name like ?", [x]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            log(data["rows"]);
            
            response = new HttpResponse(
                "Change Info Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    order: async (req, res) => {
        let response;
        let name = req.body.name;
        let response_data = {};
        try {
            let sql = sqlString.format("select * from product where name = ?", [name]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            response_data = {
                "lineId": data["rows"][0].lineId,
                "name": data["rows"][0].name,
                "brand": data["rows"][0].brand,
                "variantName": data["rows"][0].variantName,
                "rate": data["rows"][0].rate,
                "category": data["rows"][0].category,
                "default_price": data["rows"][0].default_price,
                "description": data["rows"][0].description
            }
            let options = [];
            let images = [];
            for (let index = 0; index < data["rows"].length; index++) {
                const element = data["rows"][index];
                let option = {
                    "id": element.id,
                    "name": element.name,
                    "price": element.price,
                    "quantity": element.quantity,
                    "featured_image": element.featured_image,
                    "image": element.image
                }
                options.push(option);
                images.push({"id":element.id,"link":element.image});
            }
            response_data.images = images;
            response_data.options = options;
            response = new HttpResponse(
                response_data,
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    viewOrder: async (req, res) => {
        let response;
        let name = req.body.name;
        let response_data = {};
        try {
            let sql = sqlString.format("select * from product where name = ?", [name]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            response_data = {
                "lineId": data["rows"][0].lineId,
                "name": data["rows"][0].name,
                "brand": data["rows"][0].brand,
                "variantName": data["rows"][0].variantName,
                "rate": data["rows"][0].rate,
                "category": data["rows"][0].category,
                "default_price": data["rows"][0].default_price,
                "description": data["rows"][0].description
            }
            let options = [];
            let images = [];
            for (let index = 0; index < data["rows"].length; index++) {
                const element = data["rows"][index];
                let option = {
                    "id": element.id,
                    "name": element.name,
                    "price": element.price,
                    "quantity": element.quantity,
                    "featured_image": element.featured_image,
                    "image": element.image
                }
                options.push(option);
                images.push({"id":element.id,"link":element.image});
            }
            response_data.images = images;
            response_data.options = options;
            response = new HttpResponse(
                response_data,
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    addAddress: async (req, res) => {
        let response;
        let category = req.body.category;
        try {
            let sql = sqlString.format("select * DISTINCT name from product where category = ?", [category]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            log(data["rows"]);
            
            response = new HttpResponse(
                "Change Info Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    editAddress: async (req, res) => {
        let response;
        let category = req.body.category;
        try {
            let sql = sqlString.format("select * DISTINCT name from product where category = ?", [category]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            log(data["rows"]);
            
            response = new HttpResponse(
                "Change Info Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    deleteAddress: async (req, res) => {
        let response;
        let category = req.body.category;
        try {
            let sql = sqlString.format("select * DISTINCT name from product where category = ?", [category]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            log(data["rows"]);
            
            response = new HttpResponse(
                "Change Info Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
};
