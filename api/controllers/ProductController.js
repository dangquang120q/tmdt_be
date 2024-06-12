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
const { getProductByProductLine } = require("../services/product");

module.exports = {
  getCategory: async (req, res) => {
    let response;
    try {
      let sql = sqlString.format("select * from Category");
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(data["rows"], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getProductByCategory: async (req, res) => {
    let response;
    let category = req.body.category;
    try {
      let sqlStr = category
        ? sqlString.format(
            "select *, id as lineId from ProductLine where categoryId = ?",
            [category]
          )
        : sqlString.format("select *, id as lineId from ProductLine");
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlStr);
      const productLineList = data["rows"];
      let response_data = [];

      // Get product option
      for (let index = 0; index < productLineList.length; index++) {
        const productLine = await getProductByProductLine(
          productLineList[index]
        );
        response_data.push(productLine);
      }

      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  searchProduct: async (req, res) => {
    let response;
    let name = req.body.name;

    try {
      let x = `%${name.toLowerCase()}%`;
      let sql = sqlString.format(
        "select *, id as lineId from ProductLine where name like ?",
        [x]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      let response_data = [];
      console.log(data["rows"]);
      for (let index = 0; index < data["rows"].length; index++) {
        const element = await getProductByProductLine(data["rows"][index]);
        response_data.push(element);
      }

      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
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
      let sql = sqlString.format(
        "select *, id as lineId from ProductLine where id = ?",
        [lineId]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response_data = await getProductByProductLine(data["rows"][0]);
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  updateProductInfor: async (req, res) => {
    const {
      id,
      brand,
      categoryId,
      defaultPrice,
      description,
      name,
      variantName,
      weight,
      type,
    } = req.body;
    try {
      let sql,
        msg,
        response,
        resData = {};
      if (type == 2) {
        sql = sqlString.format(
          "UPDATE ProductLine SET brand = ?, categoryId = ?, defaultPrice = ?, description = ?, name = ?,  variantName = ?, weight = ? WHERE id = ?",
          [
            brand,
            categoryId,
            defaultPrice,
            description,
            name,
            variantName,
            weight,
            id,
          ]
        );
        msg = "Update Product Successful!";
      } else if (type == 1) {
        sql = sqlString.format(
          "INSERT INTO ProductLine(brand,categoryId,defaultPrice,description,name,variantName,weight) VALUES (?,?,?,?,?,?,?)",
          [
            brand,
            categoryId,
            defaultPrice,
            description,
            name,
            variantName,
            weight,
          ]
        );
        msg = "Add Product Successful!";
      } else if (type == 3) {
        sql = sqlString.format("DELETE FROM ProductLine WHERE id = ?", [id]);
        msg = "Delete Product Successful!";
      }
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (type == 1) {
        const sqlSelect = sqlString.format(
          "SELECT id FROM ProductLine WHERE name = ?",
          [name]
        );
        const data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlSelect);
        resData = { id: data["rows"][0].id };
      }
      response = new HttpResponse(
        { msg: msg, ...resData },
        {
          statusCode: 200,
          error: false,
        }
      );
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeProductOptions: async (req, res) => {
    const { type, option } = req.body;
    const { lineId, optionName, price, quantity, image, featureImage } = option;
    let sql;
    try {
      if (type == 1) {
        sql = sqlString.format(
          "insert into Product(optionName, price, quantity,image,featureImage,lineId) values(?,?,?,?,?,?)",
          [optionName, price, quantity, image, featureImage, lineId]
        );
      } else if (type == 2) {
        sql = sqlString.format(
          "UPDATE Product SET optionName = ?, price = ?, quantity = ?, image = ?, featureImage = ? WHERE id = ?",
          [optionName, price, quantity, image, featureImage, option.id]
        );
      } else if (type == 3) {
        sql = sqlString.format("DELETE FROM Product WHERE id = ?", [option.id]);
      }
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let sqlGet = sqlString.format("SELECT * FROM Product WHERE lineId = ?", [
        lineId,
      ]);
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlGet);
      let response = new HttpResponse(
        { msg: "Change Option Successful", options: data["rows"] },
        {
          statusCode: 200,
          error: false,
        }
      );
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeProductImage: async (req, res) => {
    let { id, image, type, lineId } = req.body;
    try {
      let sql;
      if (type == 1) {
        sql = sqlString.format(
          "INSERT INTO ProductImage(image,lineId) VALUES(?,?)",
          [image, lineId]
        );
      } else if (type == 2) {
        sql = sqlString.format("DELETE FROM ProductImage WHERE id = ?", [id]);
      }
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let response = new HttpResponse(
        { msg: "Change Product Image Successful" },
        {
          statusCode: 200,
          error: false,
        }
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
    let headline = req.body.headline;
    let rate = req.body.rate;
    try {
      let sql = sqlString.format("select * from Customer where id = ?", [
        customer_id,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].length == 0) {
        response = new HttpResponse(
          { msg: "No Customer Detected" },
          { statusCode: 403, error: true }
        );
        res.status(403);
        return res.send(response);
      } else {
        let sqlFeedback = sqlString.format("call sp_add_feedback(?,?,?,?,?)", [
          product_id,
          customer_id,
          content,
          rate,
          headline,
        ]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlFeedback);
        response = new HttpResponse("Send Feedback Succesful", {
          statusCode: 200,
          error: false,
        });
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
      let sql = sqlString.format("select * from Feedback where productId = ?", [
        lineId,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      // let sql = sqlString.format("select * from Feedback where product_id = ?", [product_id]);
      // let data = await sails
      //   .getDatastore(process.env.MYSQL_DATASTORE)
      //   .sendNativeQuery(sql);
      response_data = {};
      let rates = [0, 0, 0, 0, 0];
      let comments = [];
      for (let index = 0; index < data["rows"].length; index++) {
        let sqlReply = sqlString.format(
          "select * from FeedbackReply where feedbackId = ?",
          [data["rows"][index].id]
        );
        let dataReply = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlReply);
        rates[data["rows"][index]["rate"] - 1] += 1;
        let sqlUser = sqlString.format("select * from Customer where id = ?", [
          data["rows"][index]["customerId"],
        ]);
        let dataUser = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlUser);
        comments.push({
          name: dataUser["rows"][0]["name"],
          avatar: dataUser["rows"][0]["avatar"],
          rate: data["rows"][index]["rate"],
          content: data["rows"][index]["content"],
          headline: data["rows"][index]["headline"],
          createdAt: new Date(data["rows"][index]["createdAt"]),
          reply: dataReply["rows"],
        });
      }
      response_data.rate_avg =
        (rates[0] * 1 +
          rates[1] * 2 +
          rates[2] * 3 +
          rates[3] * 4 +
          rates[4] * 5) /
        data["rows"].length;
      response_data.rates = rates;
      response_data.comments = comments;
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
};
