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
  signup: async (req, res) => {
    log("Signup from user: " + JSON.stringify(req.body));
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    let role = req.body.role;
    let name = req.body.name;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let avatar = req.body.avatar;
    try {
      let sql = sqlString.format("select * from User where username = ?", [
        username,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].length != 0) {
        response = new HttpResponse(
          { msg: "Username existed" },
          { statusCode: 402, error: true }
        );
        res.status(402);
        return res.send(response);
      } else {
        let sqlInsertUser = sqlString.format(
          "insert into User(username,password,email,phone) values(?,?,?,?)",
          [username, password, email, phone, role]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlInsertUser);
        if (role == "customer") {
          let sqlGetId = sqlString.format(
            "select id from User where username = ?",
            [username]
          );
          let data = await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sqlGetId);
          let sqlInsertCustomer = sqlString.format(
            "insert into Customer(id,name,gender,dob,avatar) values(?,?,?,?,?)",
            [data["rows"][0]["id"], name, gender, dob, avatar]
          );
          await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sqlInsertCustomer);
        }
        response = new HttpResponse(
          { msg: "Signup successful" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  login: async (req, res) => {
    log("Login from user: " + JSON.stringify(req.body));
    let username = req.body.username;
    let password = req.body.password;
    try {
      let sql = sqlString.format(
        "select * from User inner join Customer on User.id = Customer.id where username = ? and password = ?",
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

  changeInfo: async (req, res) => {
    let response;
    let name = req.body.name;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let avatar = req.body.avatar;
    let customer_id = req.body.customer_id;
    try {
      let sqlUpdate = sqlString.format(
        "update Customer set name = ?,gender = ?,dob = ?,avatar = ? where id = ?",
        [name, gender, dob, avatar, customer_id]
      );
      log(sqlUpdate);
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse("Change Info Successful", {
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
      let sql = sqlString.format("select * from Review where customer_id = ?", [
        customer_id,
      ]);
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
};
