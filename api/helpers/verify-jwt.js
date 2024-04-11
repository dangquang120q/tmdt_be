var jwt = require('jsonwebtoken');

module.exports = {


  friendlyName: 'Verify jwt',


  description: 'Verify a JWT Token',
    inputs: {
        req: {
            type: 'ref',
            friendlyName: 'Request',
            description: 'Request object from FE',
            required: true
        },
        res: {
            type: 'ref',
            friendlyName: 'Response',
            description: 'Response to the FE',
            require: false
        }
    },
    exits: {
        invalid: {
            description: 'Invalid token or no authentication present.',
        }
    },
    fn: function(inputs, exits) {
        // console.log(inputs);
        let req = inputs.req;
        console.log("inputs: " + inputs);
        let res = inputs.res;
        if(req.header('Authorization')) {
            console.log("header: " + JSON.stringify(req.header));
            let token = req.header('Authorization').split('Bearer ')[1];
            
            if(!token) {
                return exits.invalid();
            }
            return jwt.verify(token, process.env.JWT_TOKEN, async function(err, payload) {
                if(err || !payload.data) {
                    console.log(payload);
                    return exits.invalid();
                }
                console.log("1,", payload);
                //Query user from database
                let userData = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery('Select * from users where userId=$1', [payload.data.userId]);
                let user = userData["rows"][0]["userId"];
                console.log("user", user);
                if (!user) return exits.invalid();
                req.user = user;
                return exits.success(user);
            })
        } else {
            console.log("sai roi : " + req);
        }
        return exits.invalid();
    }
};

