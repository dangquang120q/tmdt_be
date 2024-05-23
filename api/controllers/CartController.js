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
        let customer_id = req.body.customer_id;
        let product_id = req.body.product_id;
        let qty = req.body.qty;
        let totalPrice = req.body.totalPrice;
        try {
            let sqlGet = sqlString.format("select id from Cart where customer_id = ?", [customer_id]);
            let dataGet = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlGet);
            let sqlGet2 = sqlString.format("select * from CartLine where product_id = ? and cart_id = ?", [product_id,dataGet["rows"][0]["id"]]);
            let dataGet2 = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlGet2);
            let sqlGet3 = sqlString.format("select * from Product where id = ?", [product_id]);
            let dataGet3 = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlGet3);
            if (dataGet2["rows"].length == 0) {
                let sql = sqlString.format("insert into CartLine(cart_id,product_id,qty,totalPrice) values(?,?,?,?)", [dataGet["rows"][0]["id"],product_id,qty,dataGet3["rows"][0]["price"] * qty]);
                await sails
                    .getDatastore(process.env.MYSQL_DATASTORE)
                    .sendNativeQuery(sql);
            }
            else{
                let sql = sqlString.format("update CartLine set qty = qty + ?,totalPrice = totalPrice + ? where id = ?", [qty,qty * dataGet3["rows"][0]["price"],dataGet2["rows"][0]["id"]]);
                await sails
                    .getDatastore(process.env.MYSQL_DATASTORE)
                    .sendNativeQuery(sql);
            }
            response = new HttpResponse(
            "Add to Cart Successful",
            { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    viewCart: async (req, res) => {
        let response;
        let customer_id = req.body.customer_id;
        try {
            let sqlGet = sqlString.format("select id from Cart where customer_id = ?", [customer_id]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlGet);
            let sql = sqlString.format("select * from CartLine where cart_id = ?", [data["rows"][0]["id"]]);
            let data2 = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            response = new HttpResponse(
                data2["rows"],
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
            let sql = sqlString.format("select * from Product where name = ?", [name]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
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
            let sql = sqlString.format("select * from Product where name = ?", [name]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            response = new HttpResponse(
                response_data,
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    listAddress: async (req, res) => {
        let response;
        let customer_id = req.body.customer_id;
        try {
            let sql = sqlString.format("select * from Address where customer_id = ?", [customer_id]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql); 
            response = new HttpResponse(
                data["rows"],
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    addAddress: async (req, res) => {
        let response;
        let customer_id = req.body.customer_id;
        let name = req.body.name;
        let phone = req.body.phone;
        let address = req.body.address;
        let type = req.body.type;
        try {
            let sqlCount = sqlString.format("select COUNT(*) as count from Address");
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlCount); 

            let sql = sqlString.format("insert into Address(id,customer_id,name,phone,address,type) values(?,?,?,?,?,?)", [+(data["rows"][0]["count"]) + 1,customer_id,name,phone,address,type]);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql); 
            response = new HttpResponse(
                "Add Address Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    editAddress: async (req, res) => {
        let response;
        let customer_id = req.body.customer_id;
        let id = req.body.address_id;
        let name = req.body.name;
        let phone = req.body.phone;
        let address = req.body.address;
        let type = req.body.type;
        try {
            let sql = sqlString.format("update Address set name = ?,phone = ?,address = ?,type = ? where id = ?", [name,phone,address,type,id]);
            log(sql);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            response = new HttpResponse(
                "Update Address Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    deleteAddress: async (req, res) => {
        let response;
        let id = req.body.address_id;
        try {
            let sql = sqlString.format("delete from Address where id = ?", [id]);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);

            response = new HttpResponse(
                "Delete Address Successful",
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
};
