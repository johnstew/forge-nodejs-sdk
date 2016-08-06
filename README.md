# Forge Node.JS SDK

## Install

    npm install forge-nodejs-sdk --save

## Samples

See `./sample/` directory.

### How to run a sample

    npm install # install dependencies
    set FORGE_TARGET=yourtarget
    # ensure to have a valid configuration file "config.yourtarget.json" 
    node ./sample/waitForNotifications.js

## How to publish new version

    git commit -a -m "message"

    npm version major|minor|patch
    git push
    npm publish
