# Forge Node.JS SDK

## Install

    npm install forge-nodejs-sdk --save

## Usage

    // Require sdk main module
    const sdk = require("forge-nodejs-sdk");
    // Available classes
    const ForgeManagementApi = sdk.ForgeManagementApi;
    const ForgeNotificationBus = sdk.ForgeNotificationBus;
    const ForgeCommands = sdk.ForgeCommands;
    const ForgeDistributionApi = sdk.ForgeDistributionApi;
    const ForgeFrontEndApi = sdk.ForgeFrontEndApi;

Consider that most methods returns Es6 `Promise`,
write the correct implementation code to catch errors and handle continuation.

### How to call a management API

    let api = new ForgeManagementApi(config.managementApi);
    api.getStories("working")
      .then((stories) => {
        // TODO your code
      });

### How to send a command

    let api = new ForgeManagementApi(config.managementApi);
    let notificationBus = new ForgeNotificationBus(config.serviceBus);
    api.autoWaitCommandNotification(notificationBus);

    function connect(){
    	return notificationBus.startReceiving();
    }
    function disconnect(){
    	return notificationBus.stopReceiving();
    }

    connect()
    .then(() => {
      let cmd = new ForgeCommands.CreateStory({
    		translationInfo: {culture:"en-us"}
    	});

      return api.post(cmd)
    })
    .then(disconnect, disconnect);

### How to subscribe to notification

    let notificationBus = new ForgeNotificationBus(config.serviceBus);

    function connect(){
    	return notificationBus.startReceiving();
    }
    // function disconnect(){
    // 	return notificationBus.stopReceiving();
    // }

    connect()
    .then(() => {
    	notificationBus.on("EntityDistributionNotification", (e) => {
        // TODO your code
    	});
    });


### Configuration

Forge node.js SDK expects a configuration defined like this:

    {
      "managementApi":{
        "authKey": "f083d945-a644-41f1-9d2f-ff9b7fd5cd01",
        "url": "http://localhost:60191/"
      },
      "serviceBus":{
        "url": "amqp://guest:guest@localhost:5672"
      },
      "distributionApi":{
        "url": "http://localhost:60192/"
      },
      "frontEnd":{
        "url": "http://localhost:54787/",
        "authKey": "00174056-D0E4-4983-9202-114F1339F6C9"
      }
    }


## Samples

See `./sample/` directory.

### How to run a sample

    npm install # install dependencies
    set FORGE_TARGET=yourtarget
    # ensure to have a valid configuration file "config.yourtarget.json"
    node ./sample/waitForNotifications.js

By default samples load configuration from `config.localhost.json`. You can read
another configuration file by changing the `FORGE_TARGET` environment variable.
For example:

    set FORGE_TARGET=webplu-test

will load the configuration file `config.webplu-test.json`.

## How to publish new version of the SDK

    git commit -a -m "message"

    npm version major|minor|patch
    git push
    npm publish
