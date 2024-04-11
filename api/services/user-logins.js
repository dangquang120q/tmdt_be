const CryptoJS = require('crypto-js');
const {sync} = require('load-json-file');
const sqlString = require('sqlstring');

const jwtoken = require('./jwtoken');
const {log} = require('./log');
const password = require('./password');
const {HttpResponse} = require('./http-response');

module.exports = {
    deviceLogin: async(req, newGame, res) => {
        log('deviceLogin => ' + req.headers['x-auth-signature']);
        let deviceId = 'd_' + CryptoJS.MD5(req.body.deviceId).toString();
        let signature = req.headers['x-auth-signature'];
        try{
            if(signature != undefined) {
                if(password.checkPasswordSalt(signature, req.body.deviceId)) {
                  let currentTime = Date.now();
                  let expiredIn = currentTime + parseInt(process.env.LOGIN_TOKEN_EXPIRED);
                  log('expired = ' + process.env.LOGIN_TOKEN_EXPIRED + ":time==" + expiredIn + ":current==" + currentTime); 
                  let loginToken = CryptoJS.MD5(signature + currentTime) + "|" +  expiredIn;
                  let sql = sqlString.format("CALL sp_login_device(?,?,?,?,?)", [deviceId, signature, loginToken, req.body.deviceId, JSON.stringify(newGame)]);
                  log('deviceLogin => sql: ' + sql);
                  let data = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sql);
          
                  let jwtToken = jwtoken.sign({userId: data["rows"][0][0].userId});
                  let response_data = {};
          
                  response_data.jwt = jwtToken;
                  response_data.userData = data["rows"][0][0];
                  log(JSON.stringify(data["rows"][0][0]));
                  response_data.userData.loginToken = data["rows"][0][0]["loginToken"].split("|")[0];
                  response = new HttpResponse(response_data, {statusCode: 200, error: false});
                  return res.ok(response);
                } else {
                  log('deviceLogin => Wrong signature:' + signature);
                  response = new HttpResponse({"msg": "Wrong password salt"}, {statusCode: 401, error: true});
                  return res.serverError(response);
                }
              } else {
                log('deviceLogin => No signature:' + deviceId);
                response = new HttpResponse({"msg": "No signature"}, {statusCode: 500, error: true});
                return res.serverError(response);
              } 
        } catch(error) {
            log('deviceLogin => Error:' + error);
            response = new HttpResponse({"msg": "Error: " + error}, {statusCode: 500, error: true});
            return res.serverError(response);
        }
        
    },

    normalLogin: async(req, res) => {
        log('normalLogin => ' + req.headers['x-auth-signature']);

        let username = req.body.username;
        let pass = req.body.password;

        let signature = req.headers['x-auth-signature'];
        try{
            if(signature != undefined) {
                if(password.checkPasswordSalt(signature, req.body.u)) {
                    let currentTime = Date.now();
                    let expiredIn = currentTime + parseInt(process.env.LOGIN_TOKEN_EXPIRED);
                    let loginToken = CryptoJS.MD5(signature + currentTime) + "|" +  expiredIn;

                    let sql = sqlString.format("CALL sp_normal_login(?,?,?,@output)", [username, CryptoJS.MD5(pass).toString(), loginToken]);
                    log('normalLogin => sql: ' + sql);
                    let data = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sql);
                    if(data["rows"][0][0]["refValue"] == 1) {
                        log(JSON.stringify(data["rows"][0]));
                        let response_data = {};
                        let jwtToken = jwtoken.sign({userId: data["rows"][0][1].userId});
                        response_data.jwt = jwtToken;
                        response_data.userData = data["rows"][1];
                        response_data.userData.loginToken = data["rows"][0][1]["loginToken"].split("|")[0];
                        response = new HttpResponse(response_data, {statusCode: 200, error: false});
                        return res.ok(response);
                    } else {
                        log(JSON.stringify(data["rows"][0]));
                        if(data["rows"][0][0]["refValue"] == -1) {
                            response = new HttpResponse({"msg": "Wrong password"}, {statusCode: 401, error: true});
                            return res.serverError(response);
                        } else if(data["rows"][0][0]["refValue"] == -2) {
                            response = new HttpResponse({"msg": "Username not existed"}, {statusCode: 401, error: true});
                            return res.serverError(response);
                        }
                    }
                } else {
                    log('normalLogin => Wrong signature:' + signature);
                    response = new HttpResponse({"msg": "Wrong password salt"}, {statusCode: 401, error: true});
                    return res.serverError(response);
                }
            } else {
                log('normalLogin => No signature:' + username);
                response = new HttpResponse({"msg": "No signature"}, {statusCode: 500, error: true});
                return res.serverError(response);
            } 

        } catch(error) {
            log('deviceLogin => Error:' + error);
            response = new HttpResponse({"msg": "Error: " + error}, {statusCode: 500, error: true});
            return res.serverError(response);
        }
    }
}