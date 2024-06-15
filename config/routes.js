/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },
  // 'GET /swagger': 'docs/dist/index.html',
  "POST /user/signup": "UsersController.signup",
  "POST /user/login": "UsersController.login",
  "POST /user/getUser": "UsersController.getUser",
  "POST /user/changeInfo": "UsersController.changeInfo",
  "POST /user/logout": "UsersController.logout",
  "POST /user/sendReview": "UsersController.sendReview",
  "POST /user/getReview": "UsersController.getReview",
  "POST /user/addFavourite": "UsersController.addFavourite",
  "POST /user/getFavourite": "UsersController.getFavourite",

  "POST /staff/login": "StaffController.login",
  "POST /staff/changeProduct": "StaffController.changeProduct",
  "POST /staff/changeCategory": "StaffController.changeCategory",
  "POST /staff/changeVoucher": "StaffController.changeVoucher",
  "POST /staff/changeShippingType": "StaffController.changeShippingType",
  "POST /user/sendReview": "StaffController.sendReview",
  "POST /user/getReview": "StaffController.getReview",
  "POST /user/addFavourite": "StaffController.addFavourite",
  "POST /user/getFavourite": "StaffController.getFavourite",

  "POST /product/getCategory": "ProductController.getCategory",
  "POST /product/getProductByCategory":
    "ProductController.getProductByCategory",
  "POST /product/searchProduct": "ProductController.searchProduct",
  "POST /product/viewProduct": "ProductController.viewProduct",
  "POST /product/sendFeedback": "ProductController.sendFeedback",
  "POST /product/getFeedback": "ProductController.getFeedback",
  "POST /product/updateInfo": "ProductController.updateProductInfor",
  "POST /product/changeOption": "ProductController.changeProductOptions",
  "POST /product/changeImage": "ProductController.changeProductImage",
  "POST /product/checkFeedback": "ProductController.checkFeedback",

  "POST /cart/addProductToCart": "CartController.addProductToCart",
  "POST /cart/viewCart": "CartController.viewCart",
  "POST /cart/deleteCart": "CartController.deleteCartLine",
  "POST /cart/updateCart": "CartController.updateCart",

  "POST /cart/listAddress": "CartController.listAddress",
  "POST /cart/addAddress": "CartController.addAddress",
  "POST /cart/editAddress": "CartController.editAddress",
  "POST /cart/deleteAddress": "CartController.deleteAddress",

  "POST /order/shippingType": "OrderController.getShippingType",
  "POST /order/getVoucherOrder": "OrderController.getVoucherOrder",
  "POST /order/createOrder": "OrderController.createOrder",
  "POST /order/getListOrderByCustomer":
    "OrderController.getListOrderByCustomer",
  "POST /order/updateOrderStatus": "OrderController.updateOrderStatus",
  "POST /order/getOrder": "OrderController.getOrder",
  "GET /order/getAll": "OrderController.getListOrder",

  "POST /admin/getListUser": "StaffController.getListUser",
  "POST /admin/deleteUser": "StaffController.deleteUser",

  "POST /admin/changeReviewReply": "AdminController.changeReviewReply",
  "POST /admin/changeStaff": "AdminController.changeStaff",
  "POST /admin/getStaff": "AdminController.getStaff",
  "POST /admin/getListStaff": "AdminController.getListStaff",
  "POST /staff/statistics": "StaffController.statistics",
  "POST /staff/productStatistics": "StaffController.productStatistics",
  "POST /staff/productLineStatistics": "StaffController.productLineStatistics",
  "POST /staff/getListFeedback": "StaffController.getListFeedback",
  "POST /staff/changeFeedbackReply": "StaffController.changeFeedbackReply",
  "POST /staff/getFeedbackReply": "StaffController.getFeedbackReply",
  "POST /staff/getListVoucher": "StaffController.getListVoucher",

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
