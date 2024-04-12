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
    getProductByCategory: async (req, res) => {
        let response;
        let category = req.body.category;
        try {
            let sql = sqlString.format("select * from Product where category = ?", [category]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            let response_data = {};
            for (let index = 0; index < data["rows"].length; index++) {
                const element = data["rows"][index];
                let x = element.name;
                if (!response_data[x]) {
                    response_data[x] = {
                        "lineId": element.lineId,
                        "name": element.name,
                        "brand": element.brand,
                        "variantName": element.variantName,
                        "rate": element.rate,
                        "category": element.category,
                        "default_price": element.default_price,
                        "description": element.description
                    }
                    let options = [];
                    let images = [];
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
                    response_data[x].images = images;
                    response_data[x].options = options;
                }
                else{
                    let option = {
                        "id": element.id,
                        "name": element.name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "featured_image": element.featured_image,
                        "image": element.image
                    }
                    response_data[x].options.push(option);
                    response_data[x].images.push({"id":element.id,"link":element.image});
                }
            }
            let response_arr = [];
            for (let key in response_data) {
                const element = response_data[key];
                response_arr.push(element);
            }
            response = new HttpResponse(
                response_arr,
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    searchProduct: async (req, res) => {
        let response;
        let name = req.body.name;
        try {
            let x = `%${name}%`
            let sql = sqlString.format("select * from Product where name like ?", [x]);
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
            
            let response_data = {};
            for (let index = 0; index < data["rows"].length; index++) {
                const element = data["rows"][index];
                let x = element.name;
                if (!response_data[x]) {
                    response_data[x] = {
                        "lineId": element.lineId,
                        "name": element.name,
                        "brand": element.brand,
                        "variantName": element.variantName,
                        "rate": element.rate,
                        "category": element.category,
                        "default_price": element.default_price,
                        "description": element.description
                    }
                    let options = [];
                    let images = [];
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
                    response_data[x].images = images;
                    response_data[x].options = options;
                }
                else{
                    let option = {
                        "id": element.id,
                        "name": element.name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "featured_image": element.featured_image,
                        "image": element.image
                    }
                    response_data[x].options.push(option);
                    response_data[x].images.push({"id":element.id,"link":element.image});
                }
            }
            let response_arr = [];
            for (let key in response_data) {
                const element = response_data[key];
                response_arr.push(element);
            }
            response = new HttpResponse(
                response_arr,
                { statusCode: 200, error: false }
            );
            return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
    },
    viewProduct: async (req, res) => {
        let response;
        let name = req.body.name;
        let response_data = {};
        try {
            let sql = sqlString.format("select * from Product where name = ?", [name]);
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
    sendFeedback: async (req, res) => {
        let customer_id = req.body.customer_id;
        let product_id = req.body.product_id;
        let content = req.body.content;
        let rate = req.body.rate;
        try {
          let sql = sqlString.format("select * from Customer where id = ?", [customer_id]);
          let data = await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sql);
          if(data["rows"].length == 0){
            response = new HttpResponse(
              { msg: "No Customer Detected" },
              { statusCode: 403, error: true }
            );
            res.status(403);
            return res.send(response);
          }
          else{
            let sqlFeedback = sqlString.format("insert into Feedback(product_id,customer_id,content,rate) values(?,?,?,?)", [product_id,customer_id,content,rate]);
            await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sqlFeedback);
            response = new HttpResponse(
              "Send Feedback Succesful",
              { statusCode: 200, error: false }
            );
            return res.ok(response);
          }
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
      },
      getFeedback: async (req, res) => {
        log("getFeedback from user: " + JSON.stringify(req.body));
        let product_id = req.body.product_id;
        try {
          let response_data = {};
          let sql = sqlString.format("select * from Feedback where product_id = ?", [product_id]);
          let data = await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sql);
          response_data = data["rows"];
          for (let index = 0; index < data["rows"].length; index++) {
            let sql = sqlString.format("select * from FeedbackReply where feedback_id = ?", [response_data[index].id]);
            let data = await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sql);
            response_data[index].reply = data["rows"];
          }
          response = new HttpResponse(
            response_data,
            { statusCode: 200, error: false }
          );
          return res.ok(response);
        } catch (error) {
          return res.serverError("Something bad happened on the server: " + error);
        }
      },
};
