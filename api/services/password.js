let bcrypt = require('bcrypt-nodejs');
let CryptoJS = require('crypto-js'); 
module.exports = {
    'comparePassword': function(password, userPass) {
        return bcrypt.compareSync(password, userPass);
    },

    'hashPassword': function(password) {
        return bcrypt.hashSync(password);
    },

    'checkPasswordSalt': function(passwordSalt, walletId) {
        let salt = CryptoJS.SHA256(walletId + process.env.PASSWORD_TOKEN);
        if(salt == passwordSalt) {
            return true;
        } else {
            return false;
        }
    },

    'checkGameHeader': function(token, walletId) {
        let d_ = CryptoJS.MD5(walletId + "|" + process.env.PASSWORD_TOKEN).toString();
        console.log(token + ": " + walletId + ": " + process.env.PASSWORD_TOKEN + ":" + d_);
        if(d_ == token) {
            return true;
        } else {
            return false;
        }
    }
}