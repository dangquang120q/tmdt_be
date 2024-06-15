/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require("sqlstring");
const { HttpResponse } = require("../services/http-response");
const { log } = require("../services/log");
const { sync } = require("load-json-file");

module.exports = {
  login: async (req, res) => {
    log("Login from user: " + JSON.stringify(req.body));
    let username = req.body.username;
    let password = req.body.password;
    try {
      let sql = sqlString.format(
        "select * from User inner join Staff on User.id = Staff.id where username = ? and password = ?",
        [username, password]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].length == 0) {
        response = new HttpResponse(
          { msg: "Wrong username or password" },
          { statusCode: 401, error: true }
        );
        res.status(401);
        return res.send(response);
      } else {
        response = new HttpResponse(data["rows"][0], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeCategory: async (req, res) => {
    let response;
    let type = req.body.type;
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    try {
      if (type == 1) {
        let sql = sqlString.format(
          "insert into Category(name,description) values(?,?)",
          [name, description]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format(
          "update Category set name = ?,description = ? where id = ?",
          [name, description, id]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from Category where id = ?", [id]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change Category Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeProduct: async (req, res) => {
    let response;
    let type = req.body.type;
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    try {
      if (type == 1) {
        let sql = sqlString.format(
          "insert into Category(name,description) values(?,?)",
          [name, description]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format(
          "update Category set name = ?,description = ? where id = ?",
          [name, description, id]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from Category where id = ?", [id]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change Category Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  sendReview: async (req, res) => {
    let customer_id = req.body.customer_id;
    let content = req.body.content;
    let rating = req.body.rating;
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
        let sqlReview = sqlString.format(
          "insert into Review(customer_id,content,rating) values(?,?,?)",
          [customer_id, content, rating]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlReview);
        response = new HttpResponse("Send Review Succesful", {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getReview: async (req, res) => {
    log("getReview from user: " + JSON.stringify(req.body));
    let customer_id = req.body.customer_id;
    try {
      let response_data = {};
      let sql = sqlString.format("select * from Review");
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response_data = data["rows"];
      for (let index = 0; index < data["rows"].length; index++) {
        let sql = sqlString.format(
          "select * from ReviewReply where review_id = ?",
          [response_data[index].id]
        );
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response_data[index].reply = data["rows"];
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
  addFavourite: async (req, res) => {
    log("addFavourite from user: " + JSON.stringify(req.body));
    let customer_id = req.body.customer_id;
    let product_id = req.body.product_id;
    try {
      let sqlFavour = sqlString.format(
        "insert into FavoritesProduct(customer_id,product_id) values(?,?)",
        [customer_id, product_id]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlFavour);
      response = new HttpResponse("Add Favourite Product Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getFavourite: async (req, res) => {
    let customer_id = req.body.customer_id;
    try {
      let sql = sqlString.format(
        "select * from FavoritesProduct where customer_id = ?",
        [customer_id]
      );
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
  getUser: async (req, res) => {
    let username = req.body.username;
    try {
      let sql = sqlString.format(
        "select * from User inner join Customer on User.id = Customer.id where username = ?",
        [username]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].length == 0) {
        response = new HttpResponse(
          { msg: "Wrong username" },
          { statusCode: 401, error: true }
        );
        res.status(401);
        return res.send(response);
      } else {
        response = new HttpResponse(data["rows"][0], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getListUser: async (req, res) => {
    let key = (req.body.key || "").toLowerCase();
    try {
      let sql;
      if (key) {
        sql = sqlString.format(
          "select * from User inner join Customer on User.id = Customer.id where username like ? or name like ?",
          [`%${key}%`, `%${key}%`]
        );
      } else {
        sql = "select * from User inner join Customer on User.id = Customer.id";
      }
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let response = new HttpResponse(data["rows"], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  deleteUser: async (req, res) => {
    let response;
    let id = req.body.id;
    try {
      let sql = sqlString.format("delete from User where id = ?", [id]);
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      response = new HttpResponse("Delete User Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  statistics: async (req, res) => {
    let response;
    let type = req.body.type;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    try {
      if (type == 1) {
        let sql = sqlString.format(`SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') AS month,
            SUM(totalPrice) AS Revenue
        FROM 
            tmdt.Order
        WHERE 
            createdAt >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY 
            DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY 
            month;
        `);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response = new HttpResponse(data["rows"], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      } else {
        let sql = sqlString.format(
          `SELECT 
              DATE(createdAt) AS date,
              SUM(totalPrice) AS total_price
          FROM 
              tmdt.Order
          WHERE 
            createdAt BETWEEN ? AND ?
          GROUP BY 
              DATE(createdAt)
          ORDER BY 
              date;
        `,
          [startDate, endDate]
        );
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response = new HttpResponse(data["rows"], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  productStatistics: async (req, res) => {
    let response;
    let type = req.body.type;
    try {
      if (type == 1) {
        let sql = sqlString.format("CALL sp_get_product_bestseller(?)", [1]);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response = new HttpResponse(data["rows"][0], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      } else {
        let sql = sqlString.format("CALL sp_get_product_bestseller(?)", [0]);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response = new HttpResponse(data["rows"][0], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  productLineStatistics: async (req, res) => {
    let response;
    let type = req.body.type;
    try {
      if (type == 1) {
        let sql = sqlString.format("CALL sp_get_productline_bestseller(?)", [
          1,
        ]);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response = new HttpResponse(data["rows"][0], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      } else {
        let sql = sqlString.format("CALL sp_get_productline_bestseller(?)", [
          0,
        ]);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        response = new HttpResponse(data["rows"][0], {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeVoucher: async (req, res) => {
    let response;
    let type = req.body.type;
    let id = req.body.id;
    let name = req.body.name;
    let discountPercent = req.body.discountPercent;
    let discountAmount = req.body.discountAmount;
    let description = req.body.description;
    let condition = req.body.condition || "";
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let quantity = req.body.quantity;
    try {
      if (type == 1) {
        let sql = sqlString.format(
          "insert into Voucher(name,discountPercent,discountAmount,description,Voucher.condition,startDate,endDate,quantity) values(?,?,?,?,?,?,?,?)",
          [
            name,
            discountPercent,
            discountAmount,
            description,
            condition,
            startDate,
            endDate,
            quantity,
          ]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format(
          "update Voucher set name = ?,discountPercent = ?,discountAmount = ?,description = ?,Voucher.condition = ?,startDate = ?,endDate = ?,quantity = ? where id = ?",
          [
            name,
            discountPercent,
            discountAmount,
            description,
            condition,
            startDate,
            endDate,
            quantity,
            id,
          ]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from Voucher where id = ?", [id]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change Voucher Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeShippingType: async (req, res) => {
    let response;
    let type = req.body.type;
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    let value = req.body.value;
    try {
      if (type == 1) {
        let sql = sqlString.format(
          "insert into ShippingType(name,description,value) values(?,?,?)",
          [name, description, value]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format(
          "update ShippingType set name = ?,description = ?,value = ? where id = ?",
          [name, description, value, id]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from ShippingType where id = ?", [
          id,
        ]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change ShippingType Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getListFeedback: async (req, res) => {
    try {
      let sql = sqlString.format("CALL sp_get_list_feedback()");
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let response = new HttpResponse(data["rows"][0], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  changeFeedbackReply: async (req, res) => {
    let type = req.body.type;
    let { feedbackId, content, staffId, id } = req.body;
    try {
      log("type", type);
      if (type == 1) {
        let sql = sqlString.format(
          "insert into FeedbackReply(feedbackId,content,staffId) values(?,?,?)",
          [feedbackId, content, staffId]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format(
          "update FeedbackReply set feedbackId = ?,content = ?,staffId = ? where id = ?",
          [feedbackId, content, staffId, id]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from FeedbackReply where id = ?", [
          id,
        ]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change FeedbackReply Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getFeedbackReply: async (req, res) => {
    let id = req.body.id;
    try {
      let sql = sqlString.format("CALL sp_get_feedback_reply(?)", [id]);
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let response = new HttpResponse(data["rows"][0][0], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getListVoucher: async (req, res) => {
    try {
      let sql;
      sql = "select * from Voucher";
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let response = new HttpResponse(data["rows"], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
};
