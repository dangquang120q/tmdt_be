const sqlString = require("sqlstring");

module.exports = {
  getProductByProductLine: async function (productLine) {
    let sqlProductStr = sqlString.format(
      "select * from Product where lineId = ?",
      [productLine.id]
    );
    let productList = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sqlProductStr);
    productLine.options = productList["rows"];
    let sqlImage = sqlString.format(
      "select * from ProductImage where lineId = ?",
      [productLine.id]
    );
    let dataImage = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sqlImage);

    productLine.images = dataImage["rows"];
    return productLine;
  },
  getOrderDetail: async function (order) {
    try {
      let sqlProductStr = sqlString.format("CALL sp_get_products_in_order(?)", [
        order.id,
      ]);
      let dataProducts = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlProductStr);
      order.products = dataProducts["rows"][0];
      let sqlVoucherStr = sqlString.format(
        "select * from Voucher where id = ?",
        [order.voucherId]
      );
      let dataVouchers = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlVoucherStr);
      order.voucher = dataVouchers["rows"][0];
      let sqlShippingStr = sqlString.format(
        "select * from ShippingType where id = ?",
        [order.shippingTypeId]
      );
      let dataShipping = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlShippingStr);
      order.shipping = dataShipping["rows"][0];
      return order;
    } catch (error) {
      console.log("Get order detail error", error);
      return order;
    }
  },
};
