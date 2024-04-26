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
      let sql = sqlString.format("select * from User inner join Staff on User.id = Staff.user_id where username = ? and password = ?", [username, password]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if(data["rows"].length == 0){
        response = new HttpResponse(
          { msg: "Wrong username or password" },
          { statusCode: 401, error: true }
        );
        res.status(401);
        return res.send(response);
      }
      else{
        response = new HttpResponse(
          data["rows"][0],
          { statusCode: 200, error: false }
        );
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
            let sql = sqlString.format("insert into Category(name,description) values(?,?)", [name,description]);
            log(sql);
            await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sql);
        }
        else if(type == 2){
            let sql = sqlString.format("update Category set name = ?,description = ? where id = ?", [name,description,id]);
            log(sql);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
        }
        else{
            let sql = sqlString.format("delete from Category where id = ?", [id]);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
        }
        response = new HttpResponse(
            "Change Category Successful",
            { statusCode: 200, error: false }
        );
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
            let sql = sqlString.format("insert into Category(name,description) values(?,?)", [name,description]);
            log(sql);
            await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sql);
        }
        else if(type == 2){
            let sql = sqlString.format("update Category set name = ?,description = ? where id = ?", [name,description,id]);
            log(sql);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
        }
        else{
            let sql = sqlString.format("delete from Category where id = ?", [id]);
            await sails
                .getDatastore(process.env.MYSQL_DATASTORE)
                .sendNativeQuery(sql);
        }
        response = new HttpResponse(
            "Change Category Successful",
            { statusCode: 200, error: false }
        );
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
        let sqlReview = sqlString.format("insert into Review(customer_id,content,rating) values(?,?,?)", [customer_id,content,rating]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlReview);
        response = new HttpResponse(
          "Send Review Succesful",
          { statusCode: 200, error: false }
        );
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
      let sql = sqlString.format("select * from Review where customer_id = ?", [customer_id]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response_data = data["rows"];
      for (let index = 0; index < data["rows"].length; index++) {
        let sql = sqlString.format("select * from ReviewReply where review_id = ?", [response_data[index].id]);
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
  addFavourite: async (req, res) => {
    log("addFavourite from user: " + JSON.stringify(req.body));
    let customer_id = req.body.customer_id;
    let product_id = req.body.product_id;
    try {
      let sqlFavour = sqlString.format("insert into FavoritesProduct(customer_id,product_id) values(?,?)", [customer_id,product_id]);
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlFavour);
      response = new HttpResponse(
        "Add Favourite Product Successful",
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getFavourite: async (req, res) => {
    let customer_id = req.body.customer_id;
    try {
      let sql = sqlString.format("select * from FavoritesProduct where customer_id = ?", [customer_id]);
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
  getUser: async (req, res) => {
    let username = req.body.username;
    try {
      let sql = sqlString.format("select * from User inner join Customer on User.id = Customer.id where username = ?", [username]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if(data["rows"].length == 0){
        response = new HttpResponse(
          { msg: "Wrong username" },
          { statusCode: 401, error: true }
        );
        res.status(401);
        return res.send(response);
      }
      else{
        response = new HttpResponse(
          data["rows"][0],
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
};