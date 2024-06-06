/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require("sqlstring");
const { HttpResponse } = require("../services/http-response");
const { log } = require("../services/log");
const { generateUniqueID } = require("../services/create-uuid");
const { ORDER_STATUS } = require("../services/const");
const { getOrderDetail } = require("../services/product");

module.exports = {
  getShippingType: async (req, res) => {
    try {
      let sql = sqlString.format("select * from ShippingType");
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
  getVoucherOrder: async (req, res) => {
    let customerId = req.body.customerId;
    try {
      let sql = sqlString.format("CALL sp_get_voucher_unused(?)", [customerId]);
      let data = await sails
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
  createOrder: async (req, res) => {
    let shippingId = req.body.shippingTypeId;
    let voucherId = req.body.voucherId;
    let addressId = req.body.addressId;
    let products = req.body.products;
    let totalPrice = req.body.totalPrice;
    let response;

    try {
      const product_ids = products.map((item) => item.product.id).join(",");
      const quantities = products.map((item) => item.qty).join(",");
      const prices = products.map((item) => item.product.price).join(",");
      const cart_ids = products.map((item) => item.id).join(",");
      const order_id = generateUniqueID();
      let sql = sqlString.format(
        "CALL InsertOrderAndProducts(?,?,?,?,?,?,?,?,?)",
        [
          order_id,
          shippingId,
          addressId,
          voucherId,
          totalPrice,
          product_ids,
          quantities,
          prices,
          cart_ids,
        ]
      );

      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      if (data["rows"][0][0]["ref"] == 1) {
        response = new HttpResponse(
          { msg: "Place order successful!", orderId: order_id },
          {
            statusCode: 200,
            error: false,
          }
        );
        return res.ok(response);
      } else {
        response = new HttpResponse(
          { msg: "Place order failed!", orderId: -1 },
          {
            statusCode: 403,
            error: false,
          }
        );
        return res.send(response);
      }
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },

  getListOrderByCustomer: async (req, res) => {
    const customerId = req.body.customerId;
    const type = req.body.status;
    try {
      const status = ORDER_STATUS.find((item) => item.id == type).value;
      let sql = sqlString.format("CALL sp_get_order_by_customer(?,?)", [
        customerId,
        status,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let orders = data["rows"][0];
      for (let index = 0; index < orders.length; index++) {
        orders[index] = await getOrderDetail(orders[index]);
      }
      let response = new HttpResponse(orders, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      let orderId = req.body.orderId;
      let status = req.body.status;
      let sql = sqlString.format(
        "insert into OrderTracking(orderId,status) values(?,?)",
        [orderId, status]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse("Update Order Status Successful", {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      return res.serverError("Something bad happened on the server: " + error);
    }
  },
};
