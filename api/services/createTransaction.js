let CryptoJS = require('crypto-js'); 
let axios = require('axios');
module.exports = {
    createTransaction : async (item) => {
        const config = {
            app_id: process.env.ZP_APP_ID,
            key1: process.env.ZP_KEY1,
            key2: process.env.ZP_KEY2,
            endpoint: process.env.ZP_ENDPOINT,
        };
        const embed_data = {
          // redirecturl: "http://localhost:5173/account/my-posts",
        };
        let { price, transID } = item;
      
        const items = [{ ...item }];
      
        const order = {
          app_id: config.app_id,
          app_trans_id: transID, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
          app_user: "user123",
          app_time: Date.now(), // miliseconds
          item: JSON.stringify(items),
          embed_data: JSON.stringify(embed_data),
          amount: price,
          description: `Thanh toán cho giao dịch #${transID}`,
          callback_url: process.env.API_URL + "/transaction/callback",
        };
        console.log("order===" + order)
        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
          config.app_id +
          "|" +
          order.app_trans_id +
          "|" +
          order.app_user +
          "|" +
          order.amount +
          "|" +
          order.app_time +
          "|" +
          order.embed_data +
          "|" +
          order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        try {
          const res = await axios.post(config.endpoint + "/create", null, {
            params: order,
          });
          console.log("res === " + JSON.stringify(res.data));
          return res.data;
        } catch (error) {
          console.log("create invoice error => ", error);
          return error;
        }
    }
}