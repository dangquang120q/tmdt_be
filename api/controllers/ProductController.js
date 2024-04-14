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
    getCategory: async (req, res) => {
      let response;
      try {
          let sql = sqlString.format("select * from Category");
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
    getProductByCategory: async (req, res) => {
        let response;
        let category = req.body.category;
        try {
            let sqlStr = category ? sqlString.format("select * from Product where category = ?",[category]) : sqlString.format("select * from Product");
            let data = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlStr);
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
                    let sql = sqlString.format("select * from ProductImage where lineId = ?",[element.lineId]);
                    let data = await sails
                        .getDatastore(process.env.MYSQL_DATASTORE)
                        .sendNativeQuery(sql);
                    let option = {
                        "id": element.id,
                        "name": element.name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "featured_image": element.feature_image,
                        "image": element.image
                    }
                    options.push(option);
                    response_data[x].images = data["rows"];
                    response_data[x].options = options;
                }
                else{
                    let option = {
                        "id": element.id,
                        "name": element.name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "featured_image": element.feature_image,
                        "image": element.image
                    }
                    response_data[x].options.push(option);
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
                    let sql = sqlString.format("select * from ProductImage where lineId = ?",[element.lineId]);
                    let data = await sails
                        .getDatastore(process.env.MYSQL_DATASTORE)
                        .sendNativeQuery(sql);
                    let option = {
                        "id": element.id,
                        "name": element.name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "featured_image": element.feature_image,
                        "image": element.image
                    }
                    options.push(option);
                    response_data[x].images = data["rows"];
                    response_data[x].options = options;
                }
                else{
                    let option = {
                        "id": element.id,
                        "name": element.name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "featured_image": element.feature_image,
                        "image": element.image
                    }
                    response_data[x].options.push(option);
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
        let lineId = req.body.lineId;
        let response_data = {};
        try {
            let sql = sqlString.format("select * from Product where lineId = ?", [lineId]);
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
            let sqlImage = sqlString.format("select * from ProductImage where lineId = ?",[data["rows"][0].lineId]);
            let dataImage = await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sqlImage);
            for (let index = 0; index < data["rows"].length; index++) {
                const element = data["rows"][index];
                let option = {
                    "id": element.id,
                    "name": element.name,
                    "price": element.price,
                    "quantity": element.quantity,
                    "featured_image": element.feature_image,
                    "image": element.image
                }
                options.push(option);
            }
            response_data.images = dataImage["rows"];
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
        let lineId = req.body.lineId;
        try {
          let response_data = {};
          let sql = sqlString.format("select * from Product inner join Feedback on Product.id = Feedback.product_id where lineId = ?", [lineId]);
          let data = await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sql);
          // let sql = sqlString.format("select * from Feedback where product_id = ?", [product_id]);
          // let data = await sails
          //   .getDatastore(process.env.MYSQL_DATASTORE)
          //   .sendNativeQuery(sql);
          response_data = {};
          let rates = [0,0,0,0,0];
          let comments = [];
          for (let index = 0; index < data["rows"].length; index++) {
            let sqlReply = sqlString.format("select * from FeedbackReply where feedback_id = ?", [data["rows"][index].id]);
            let dataReply = await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sqlReply);
            rates[data["rows"][index]["rate"] - 1]+=1;
            let sqlUser = sqlString.format("select * from Customer where id = ?", [data["rows"][index]["customer_id"]]);
            let dataUser = await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sqlUser);
            comments.push({
              "name": dataUser["rows"][0]["name"],
              "avatar": dataUser["rows"][0]["avatar"],
              "rate": data["rows"][index]["rate"],
              "content": data["rows"][index]["content"],
              "createdAt": new Date(data["rows"][index]["createdAt"]),
              "reply": dataReply["rows"]
            })
          }
          response_data.rate_avg = (rates[0] * 1 + rates[1] * 2 + rates[2] * 3 + rates[3] * 4 + rates[4] * 5)/data["rows"].length;
          response_data.rates = rates;
          response_data.comments = comments
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
