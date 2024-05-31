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
      let sqlGet2 = sqlString.format(
        "select * from CartLine where productId = ? and customerId = ?",
        [product_id, customer_id]
      );
      let dataGet2 = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlGet2);
      let sqlGet3 = sqlString.format("select * from Product where id = ?", [
        product_id,
      ]);
      let dataGet3 = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlGet3);
      if (dataGet2["rows"].length == 0) {
        let sql = sqlString.format(
          "insert into CartLine(productId,qty,totalPrice,customerId) values(?,?,?,?)",
          [product_id, qty, dataGet3["rows"][0]["price"] * qty, customer_id]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      } else {
        let sql = sqlString.format(
          "update CartLine set qty = qty + ?,totalPrice = totalPrice + ? where id = ?",
          [qty, qty * dataGet3["rows"][0]["price"], dataGet2["rows"][0]["id"]]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
      }
      response = new HttpResponse("Add to Cart Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  viewCart: async (req, res) => {
    let response;
    let customer_id = req.body.customer_id;
    try {
      let sql = sqlString.format(
        "select * from CartLine where customerId = ?",
        [customer_id]
      );
      let data2 = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let response_data = data2["rows"];
      for (let index = 0; index < data2["rows"].length; index++) {
        const element = data2["rows"][index];
        let sql3 = sqlString.format(
          "select Product.id, price, variantName, lineId, optionName, quantity, featureImage, image, name, brand as lineid from Product JOIN ProductLine where Product.id = ? and Product.lineId = ProductLine.id",
          [element["productId"]]
        );
        let data3 = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql3);
        response_data[index].product = data3["rows"][0];
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
  deleteCartLine: async (req, res) => {
    let response;
    let id = req.body.id;
    try {
      let sql = sqlString.format("delete from CartLine where id = ?", [id]);
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      response = new HttpResponse("Delete Item Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  updateCart: async (req, res) => {
    let response;
    let cartLineId = req.body.id;
    let qty = req.body.qty;
    try {
      let sql = sqlString.format("update CartLine set qty = ? where id = ?", [
        qty,
        cartLineId,
      ]);
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse("Update to Cart Successful", {
        statusCode: 200,
        error: false,
      });
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
      let sql = sqlString.format("select * from Product where name = ?", [
        name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
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
      let sql = sqlString.format("select * from Product where name = ?", [
        name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  listAddress: async (req, res) => {
    let response;
    let customer_id = req.body.customer_id;
    try {
      let sql = sqlString.format("select * from Address where customerId = ?", [
        customer_id,
      ]);
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

      let sql = sqlString.format(
        "insert into Address(id,customerId,name,phone,address,type) values(?,?,?,?,?,?)",
        [+data["rows"][0]["count"] + 1, customer_id, name, phone, address, type]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse("Add Address Successful", {
        statusCode: 200,
        error: false,
      });
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
      let sql = sqlString.format(
        "update Address set name = ?,phone = ?,address = ?,type = ? where id = ?",
        [name, phone, address, type, id]
      );
      log(sql);
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse("Update Address Successful", {
        statusCode: 200,
        error: false,
      });
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

      response = new HttpResponse("Delete Address Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
};
