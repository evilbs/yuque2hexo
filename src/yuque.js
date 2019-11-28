const SDK = require('@yuque/sdk');

let client;
function initSDK(token) {
  const yuqueClient = new SDK({
    token,
  });

  client = yuqueClient;
}

function main(token) {
  if (!client) {
    initSDK(token);
  }

  return client;
}

module.exports = main;
