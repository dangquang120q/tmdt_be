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
  changeStaff: async (req, res) => {
    let response;
    let type = req.body.type;
    let { dob, email, id, name, phone, position, username, password } =
      req.body;
    try {
      if (type == 1) {
        let sql = sqlString.format("CALL sp_create_staff(?,?,?,?,?,?,?)", [
          name,
          position,
          dob,
          username,
          password,
          email,
          phone,
        ]);
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format("CALL sp_update_staff(?,?,?,?,?)", [
          id,
          name,
          dob,
          email,
          phone,
        ]);
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from User where id = ?", [id]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change Staff Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  getStaff: async (req, res) => {
    let id = req.body.id;
    try {
      let sql = sqlString.format(
        "select * from User inner join Staff on User.id = Staff.id where id = ?",
        [id]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].length == 0) {
        response = new HttpResponse(
          { msg: "Wrong id" },
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
  getListStaff: async (req, res) => {
    try {
      let sql;
      sql = sqlString.format(
        "select * from User inner join Staff on User.id = Staff.id where position = ?",
        ["staff"]
      );
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
  changeReviewReply: async (req, res) => {
    let type = req.body.type;
    let { reviewId, content, adminId, id } = req.body;
    try {
      log("type", type);
      if (type == 1) {
        let sql = sqlString.format(
          "insert into ReviewReply(reviewId,content,adminId) values(?,?,?)",
          [reviewId, content, adminIdId]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else if (type == 2) {
        let sql = sqlString.format(
          "update ReviewReply set reviewId = ?,content = ?,adminId = ? where id = ?",
          [reviewId, content, adminId, id]
        );
        log(sql);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format("delete from ReviewReply where id = ?", [
          id,
        ]);
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Change Review Reply Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
};
