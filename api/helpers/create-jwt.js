var jwt = require('jsonwebtoken');

module.exports = {


  friendlyName: 'Create jwt',


  description: 'Create jwt token',


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

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    // TODO
    let req = inputs.req;
    let res = inputs.res;
    return jwt.sign({
      user: user.toJSON()
    },
    sails.config.jwtSettings.secret,
    {
      algorithm: sails.config.jwtSettings.algorithm,
      expiresInMinutes: sails.config.jwtSettings.expiresInMinutes,
      issuer: sails.config.jwtSettings.issuer,
      audience: sails.config.jwtSettings.audience
    })

  }


};

