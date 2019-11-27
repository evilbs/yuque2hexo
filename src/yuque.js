const SDK = require('@yuque/sdk');

let _client = undefined;
function _initSDK() {
  const client = new SDK({
    token: 'AA5rdr4NLXP3oY7hahAVKES6Kk4BW5ZGpmTTqFjr'
  });

  _client = client;
}

function main() {
  if (!_client) {
    _initSDK();
  }

  return _client;
}

module.exports = main;
