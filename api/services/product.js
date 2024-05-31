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
    let sqlRate = sqlString.format(
      "select avg(rate) as rate from Product where lineId = ?",
      [productLine.id]
    );
    data = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sqlRate);

    productLine.rate = data["rows"][0].rate;
    productLine.images = dataImage["rows"];
    return productLine;
  },
};
