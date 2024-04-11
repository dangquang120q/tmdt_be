module.exports = {
  apps : [{
    name: 'api-sails-gamehub',
    script: './app.js',
    watch: '.',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'DEVELOPMENT',
      PORT: 4321
    },
    instances: 1,
    autorestart: true
  }]

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
