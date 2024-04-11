const datetime = require('node-datetime');
const Web3 = require('web3');
const {WORKER_INPUTS} = require('../services/const');

module.exports = {
    'log': function (mgs) {
        var dt = datetime.create();
        var formatted = dt.format('Y-m-d H:M:S:N');
        console.log(formatted + "|" + mgs);
    },
    'parseWeb3Log': (data) => {
        try {
            let web3Instance = new Web3();
            const dataLog = web3Instance.eth.abi.decodeLog(
                WORKER_INPUTS,
                data,
                process.env.WORKER_EVENT_TOPIC.slice(1),
            );
            return dataLog;
          } catch (error) {
                console.log("Could not parseDataLog." + error);
                return "";
          }
    }

}